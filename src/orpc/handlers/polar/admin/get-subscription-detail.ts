import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { db } from "@/lib/db.server";
import { logger } from "@/lib/logger";
import { adminProcedure } from "@/orpc/context";

/**
 * Admin: Get subscription details with customer info
 */
export const getSubscriptionDetail = adminProcedure
	.input(z.object({ subscriptionId: z.string() }))
	.output(
		z.object({
			id: z.string(),
			status: z.string(),
			customerEmail: z.string().nullable(),
			customerName: z.string().nullable(),
			productName: z.string(),
			amount: z.number(),
			currency: z.string(),
			interval: z.string().nullable(),
			currentPeriodStart: z.string(),
			currentPeriodEnd: z.string().nullable(),
			cancelAtPeriodEnd: z.boolean(),
			startedAt: z.string().nullable(),
			endedAt: z.string().nullable(),
			customerId: z.string(),
			productId: z.string(),
			localUserId: z.string().nullable(),
			localUserEmail: z.string().nullable(),
		}),
	)
	.handler(async ({ input, errors }) => {
		try {
			const subscription = await polarClient.subscriptions.get({
				id: input.subscriptionId,
			});

			const price = subscription.prices?.[0];
			const priceAmount =
				price && "priceAmount" in price ? price.priceAmount : 0;
			const priceCurrency =
				price && "priceCurrency" in price ? price.priceCurrency : "USD";
			const recurringInterval =
				price && "recurringInterval" in price ? price.recurringInterval : null;

			// Find local user
			const localUser = await db.client.user.findFirst({
				where: { customerId: subscription.customerId },
				select: { id: true, email: true },
			});

			const toDateString = (val: unknown): string | null => {
				if (!val) return null;
				if (val instanceof Date) return val.toISOString();
				if (typeof val === "string") return val;
				return null;
			};

			return {
				id: subscription.id,
				status: subscription.status as string,
				customerEmail: subscription.customer?.email || null,
				customerName: subscription.customer?.name || null,
				productName: subscription.product?.name || "Unknown",
				amount: priceAmount,
				currency: priceCurrency,
				interval: recurringInterval as string | null,
				currentPeriodStart:
					toDateString(subscription.currentPeriodStart) ||
					new Date().toISOString(),
				currentPeriodEnd: toDateString(subscription.currentPeriodEnd),
				cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
				startedAt: toDateString(subscription.startedAt),
				endedAt: toDateString(subscription.endedAt),
				customerId: subscription.customerId,
				productId: subscription.productId,
				localUserId: localUser?.id || null,
				localUserEmail: localUser?.email || null,
			};
		} catch (error) {
			logger.error("[Admin] Get subscription detail error:", error);
			throw errors.NOT_FOUND({ message: "Subscription not found" });
		}
	});
