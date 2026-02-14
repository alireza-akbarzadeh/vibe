// src/server/subscription.ts

import { createServerFn } from "@tanstack/react-start";
import {
	getRequestHeaders,
	setResponseStatus,
} from "@tanstack/react-start/server";
import { z } from "zod";
import {
	POLAR_SLUG_TO_PRODUCT,
	polarClient,
} from "@/integrations/polar/polar-client";
import { AppError, Errors } from "@/lib/app-error";
import { auth } from "@/lib/better-auth";
import { prisma } from "@/lib/db";
import { Http } from "@/orpc/helpers/http";

// Checkout Subscription
const CheckoutInput = z.object({
	productId: z.string().optional(),
	slug: z.string().optional(),
	referenceId: z.string().optional(),
	redirectUrl: z.string().optional(),
});
export type CheckoutInputScheme = z.infer<typeof CheckoutInput>;

// Get Redirect URL from latest subscription
export const getPostPaymentRedirect = createServerFn({
	method: "GET",
}).handler(async () => {
	const headers = getRequestHeaders();

	try {
		const session = await auth.api.getSession({ headers });
		if (!session?.user) {
			return { redirectUrl: null };
		}

		// Get the most recent subscription with a redirectUrl
		const subscription = await prisma.subscription.findFirst({
			where: {
				userId: session.user.id,
				redirectUrl: { not: null },
			},
			orderBy: { startedAt: "desc" },
			select: { redirectUrl: true, id: true },
		});

		if (subscription?.redirectUrl) {
			await prisma.subscription.update({
				where: { id: subscription.id },
				data: { redirectUrl: null },
			});

			return { redirectUrl: subscription.redirectUrl };
		}

		return { redirectUrl: null };
	} catch (error) {
		console.error("Error fetching redirect URL:", error);
		return { redirectUrl: null };
	}
});

export const getSubscriptionStatus = createServerFn({
	method: "GET",
})
	.inputValidator(
		z.object({
			sessionToken: z.string().optional(),
		}),
	)
	.handler(async ({ data }) => {
		const headers = new Headers();
		if (data.sessionToken)
			headers.set("Authorization", `Bearer ${data.sessionToken}`);

		try {
			const session = await auth.api.getSession({ headers });
			if (!session?.user) throw Errors.unauthorized();

			return {
				status: session.user.subscriptionStatus || "NONE",
				customerId: session.user.customerId || null,
			};
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw Errors.unauthorized();
		}
	});

// Cancel Subscription
export const cancelSubscription = createServerFn({
	method: "POST",
})
	.inputValidator(
		z.object({
			subscriptionId: z.string().optional(),
			sessionToken: z.string().optional(),
		}),
	)
	.handler(async ({ data }) => {
		const headers = new Headers();
		if (data.sessionToken)
			headers.set("Authorization", `Bearer ${data.sessionToken}`);

		const session = await auth.api.getSession({ headers });
		if (!session?.user) throw Errors.unauthorized();

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				customerId: true,
				subscriptionStatus: true,
			},
		});

		if (!user) throw Errors.notFound("User");

		let subscriptionId = data.subscriptionId;
		if (!subscriptionId && user.customerId) {
			try {
				const subs = await polarClient.subscriptions.list({
					customerId: user.customerId,
					active: true,
				});
				subscriptionId = subs?.result?.items?.[0]?.id;
			} catch (err) {
				console.error("Error fetching subscriptions from Polar:", err);
				throw Errors.internal("Failed to fetch subscription details", err);
			}
		}

		if (!subscriptionId) {
			setResponseStatus(Http.BAD_REQUEST, "No active subscription found");
			return { error: "No active subscription found", alreadyCancelled: true };
		}

		try {
			await polarClient.subscriptions.update({
				id: subscriptionId,
				subscriptionUpdate: { cancelAtPeriodEnd: true },
			});

			await prisma.user.update({
				where: { id: user.id },
				data: { subscriptionStatus: "CANCELLED" },
			});

			return { success: true, pendingCancellation: true };
		} catch (err) {
			console.error("Subscription cancel error:", err);

			if (String(err).includes("AlreadyCanceledSubscription")) {
				await prisma.user.update({
					where: { id: user.id },
					data: { subscriptionStatus: "CANCELLED" },
				});
				return { success: true, pendingCancellation: true };
			}

			if (
				String(err).includes("Unauthorized") ||
				String(err).includes("invalid_token")
			) {
				throw Errors.unauthorized("Authentication failed with Polar", err);
			}

			throw Errors.internal("Failed to cancel subscription", err);
		}
	});

// Checkout Subscription
export const checkoutSubscription = createServerFn({
	method: "POST",
})
	.inputValidator(CheckoutInput)
	.handler(async ({ data }) => {
		const { productId, slug, referenceId, redirectUrl } = data;

		if (!productId && !slug) {
			setResponseStatus(
				Http.BAD_REQUEST,
				"Either productId or slug is required",
			);
			throw Errors.bad_Request("Either productId or slug is required");
		}

		const headers = getRequestHeaders();

		const session = await auth.api.getSession({ headers });
		if (!session?.user) {
			throw Errors.unauthorized();
		}

		const checkoutReferenceId =
			referenceId ?? `ref-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

		const effectiveProductId =
			productId ?? (slug ? POLAR_SLUG_TO_PRODUCT[slug] : undefined);

		if (!effectiveProductId) {
			setResponseStatus(Http.BAD_REQUEST, "Unknown product slug or productId");
			throw Errors.bad_Request("Unknown product slug or productId");
		}

		try {
			await prisma.subscription.create({
				data: {
					userId: session.user.id,
					productId: effectiveProductId,
					referenceId: checkoutReferenceId,
					redirectUrl: redirectUrl || null,
					status: "FREE",
				},
			});
		} catch (err) {
			console.error("Failed to create subscription record:", err);
			throw Errors.internal("Failed to create subscription", err);
		}

		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let response;
		try {
			response = await auth.api.checkout({
				body: {
					products: [effectiveProductId],
					referenceId: checkoutReferenceId,
				},
				headers,
			});
		} catch (err) {
			console.error("Checkout creation failed:", err);

			// Check for unauthorized error from Polar
			if (
				String(err).includes("Unauthorized") ||
				String(err).includes("invalid_token") ||
				String(err).includes("401")
			) {
				throw Errors.internal(
					"Payment provider authentication failed. Verify POLAR_ACCESS_TOKEN and environment.",
					err,
				);
			}

			throw Errors.checkoutFailed("Failed to create checkout session", err);
		}

		let checkoutUrl: string;
		if (typeof response === "string") {
			checkoutUrl = response;
		} else if (response && "url" in response) {
			checkoutUrl = (response as { url: string }).url;
		} else {
			setResponseStatus(
				Http.INTERNAL_SERVER_ERROR,
				"Unexpected response from checkout",
			);
			throw Errors.internal("Invalid checkout response format");
		}

		return { url: checkoutUrl };
	});
