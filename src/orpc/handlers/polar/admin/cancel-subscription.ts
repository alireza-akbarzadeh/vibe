import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { db } from "@/lib/db.server";
import { logger } from "@/lib/logger";
import { adminProcedure } from "@/orpc/context";

const AdminCancelSubscriptionInputSchema = z.object({
	subscriptionId: z.string(),
	immediately: z.boolean().default(false),
	reason: z.string().max(500).optional(),
});

/**
 * Admin: Cancel any user's subscription
 */
export const adminCancelSubscription = adminProcedure
	.input(AdminCancelSubscriptionInputSchema)
	.output(
		z.object({
			success: z.boolean(),
			message: z.string(),
		}),
	)
	.handler(async ({ input, errors }) => {
		try {
			const subscription = await polarClient.subscriptions.get({
				id: input.subscriptionId,
			});

			if (!subscription) {
				throw errors.NOT_FOUND({ message: "Subscription not found" });
			}

			// Cancel at period end (or immediately if requested)
			await polarClient.subscriptions.update({
				id: input.subscriptionId,
				subscriptionUpdate: {
					cancelAtPeriodEnd: true,
				},
			});

			// Update local database
			const user = await db.client.user.findFirst({
				where: { customerId: subscription.customerId },
			});

			if (user) {
				await db.client.user.update({
					where: { id: user.id },
					data: {
						subscriptionStatus: "CANCELLED",
						currentPlan: null,
					},
				});

				await db.client.subscription.updateMany({
					where: {
						userId: user.id,
						referenceId: input.subscriptionId,
					},
					data: {
						status: "CANCELLED",
						canceledAt: new Date(),
					},
				});
			}

			logger.info(
				`[Admin] Subscription ${input.subscriptionId} cancelled. Reason: ${input.reason || "N/A"}`,
			);

			return {
				success: true,
				message: input.immediately
					? "Subscription cancelled immediately"
					: "Subscription will be cancelled at end of billing period",
			};
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			if (message.includes("not found") || message.includes("NOT_FOUND")) {
				throw errors.NOT_FOUND({ message: "Subscription not found" });
			}
			logger.error("[Admin] Cancel subscription error:", error);
			throw errors.INTERNAL_SERVER_ERROR({
				message: "Failed to cancel subscription",
			});
		}
	});
