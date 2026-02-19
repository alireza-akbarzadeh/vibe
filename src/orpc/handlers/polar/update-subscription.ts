import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { authedProcedure } from "@/orpc/context";
import { UpdateSubscriptionInputSchema } from "../../models/polar";

/**
 * Update a subscription (change plan or cancel at period end)
 */
export const updateSubscription = authedProcedure
	.input(UpdateSubscriptionInputSchema)
	.output(
		z.object({
			success: z.boolean(),
			message: z.string(),
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

			// Update the subscription
			let subscriptionUpdate: any;

			if (input.productPriceId) {
				// Change to a different product
				subscriptionUpdate = {
					productId: input.productPriceId, // Note: This should actually be productId, not priceId
				};
			} else if (typeof input.cancelAtPeriodEnd !== "undefined") {
				// Cancel or reactivate subscription
				subscriptionUpdate = {
					cancelAtPeriodEnd: input.cancelAtPeriodEnd,
				};
			} else {
				throw errors.BAD_REQUEST({
					message:
						"Either productPriceId or cancelAtPeriodEnd must be provided",
				});
			}

			await polarClient.subscriptions.update({
				id: input.subscriptionId,
				subscriptionUpdate,
			});

			let message = "Subscription updated successfully";
			if (input.productPriceId) {
				message = "Subscription plan changed successfully";
			} else if (input.cancelAtPeriodEnd !== undefined) {
				message = input.cancelAtPeriodEnd
					? "Subscription will be canceled at the end of the current period"
					: "Subscription auto-renewal enabled";
			}

			return {
				success: true,
				message,
			};
		} catch (error: any) {
			console.error("Error updating subscription:", error);

			if (error.message?.includes("Access denied")) {
				throw error;
			}

			throw errors.INTERNAL_ERROR({
				message: "Failed to update subscription",
			});
		}
	});
