import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { prisma } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import { CancelSubscriptionInputSchema } from "../../models/polar";

/**
 * Cancel a subscription
 */
export const cancelSubscription = authedProcedure
	.input(CancelSubscriptionInputSchema)
	.output(
		z.object({
			success: z.boolean(),
			message: z.string(),
			canceledAt: z.string().optional(),
		}),
	)
	.handler(async ({ input, context, errors }) => {
		try {
			// Get subscription to verify ownership
			const subscription = await polarClient.subscriptions.get({
				id: input.subscriptionId,
			});

			// Verify the subscription belongs to the user
			if (subscription.customerId !== context.user.customerId) {
				throw errors.FORBIDDEN({
					message: "Access denied to this subscription",
				});
			}

			// Update subscription to cancel at period end
			const canceled = await polarClient.subscriptions.update({
				id: input.subscriptionId,
				subscriptionUpdate: {
					cancelAtPeriodEnd: true,
				},
			});

			// Update user's subscription status in database
			await prisma.user.update({
				where: { id: context.user.id },
				data: {
					subscriptionStatus: "CANCELLED",
					currentPlan: null,
				},
			});

			const canceledAt =
				canceled.currentPeriodEnd instanceof Date
					? canceled.currentPeriodEnd.toISOString()
					: canceled.currentPeriodEnd || undefined;

			return {
				success: true,
				message:
					"Subscription will be canceled at the end of the current period",
				canceledAt,
			};
		} catch (error: any) {
			console.error("Error canceling subscription:", error);

			if (error.message?.includes("Access denied")) {
				throw error;
			}

			throw errors.INTERNAL_ERROR({
				message: "Failed to cancel subscription",
			});
		}
	});
