import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { authedProcedure } from "@/orpc/context";
import { SubscriptionResponseSchema } from "../../models/polar";

/**
 * Get a specific subscription by ID
 */
export const getSubscription = authedProcedure
	.input(z.object({ subscriptionId: z.string() }))
	.output(SubscriptionResponseSchema)
	.handler(async ({ input, context, errors }) => {
		try {
			const subscription = await polarClient.subscriptions.get({
				id: input.subscriptionId,
			});

			// Verify the subscription belongs to the user
			if (subscription.customerId !== context.user.customerId) {
				throw errors.FORBIDDEN({
					message: "Access denied to this subscription",
				});
			}

			const price = subscription.prices?.[0];
			const priceAmount =
				price && "priceAmount" in price ? price.priceAmount : 0;
			const priceCurrency =
				price && "priceCurrency" in price ? price.priceCurrency : "USD";
			const recurringInterval =
				price && "recurringInterval" in price ? price.recurringInterval : null;

			return {
				id: subscription.id,
				status: subscription.status as string,
				productName: subscription.product?.name || "Unknown",
				amount: priceAmount,
				currency: priceCurrency,
				interval: recurringInterval as string | null,
				currentPeriodStart:
					subscription.currentPeriodStart instanceof Date
						? subscription.currentPeriodStart.toISOString()
						: subscription.currentPeriodStart,
				currentPeriodEnd:
					subscription.currentPeriodEnd instanceof Date
						? subscription.currentPeriodEnd.toISOString()
						: subscription.currentPeriodEnd,
				cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
			};
		} catch (error: any) {
			console.error("Error fetching subscription:", error);

			if (error.message?.includes("Access denied")) {
				throw error;
			}

			throw errors.NOT_FOUND({
				message: "Subscription not found",
			});
		}
	});
