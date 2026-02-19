import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { authedProcedure } from "@/orpc/context";
import {
	SubscriptionListQuerySchema,
	SubscriptionResponseSchema,
} from "../../models/polar";

/**
 * List all subscriptions for the authenticated user
 */
export const listSubscriptions = authedProcedure
	.input(SubscriptionListQuerySchema)
	.output(
		z.object({
			subscriptions: z.array(SubscriptionResponseSchema),
			total: z.number(),
			page: z.number(),
			limit: z.number(),
		}),
	)
	.handler(async ({ input, context }) => {
		try {
			// Get user's customer ID
			const customerId = context.user.customerId;

			if (!customerId) {
				return {
					subscriptions: [],
					total: 0,
					page: input.page,
					limit: input.limit,
				};
			}

			const response = await polarClient.subscriptions.list({
				customerId,
				limit: input.limit,
				page: input.page,
				...(input.productId && { productId: input.productId }),
			});

			const subscriptions = response.result.items.map((sub) => {
				const price = sub.prices?.[0];
				const priceAmount =
					price && "priceAmount" in price ? price.priceAmount : 0;
				const priceCurrency =
					price && "priceCurrency" in price ? price.priceCurrency : "USD";
				const recurringInterval =
					price && "recurringInterval" in price
						? price.recurringInterval
						: null;

				return {
					id: sub.id,
					status: sub.status as string,
					productName: sub.product?.name || "Unknown",
					amount: priceAmount,
					currency: priceCurrency,
					interval: recurringInterval as string | null,
					currentPeriodStart:
						sub.currentPeriodStart instanceof Date
							? sub.currentPeriodStart.toISOString()
							: sub.currentPeriodStart,
					currentPeriodEnd:
						sub.currentPeriodEnd instanceof Date
							? sub.currentPeriodEnd.toISOString()
							: sub.currentPeriodEnd,
					cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
				};
			});

			return {
				subscriptions,
				total: response.result.pagination.totalCount || 0,
				page: input.page,
				limit: input.limit,
			};
		} catch (error) {
			console.error("Error fetching subscriptions:", error);
			throw new Error("Failed to fetch subscriptions");
		}
	});
