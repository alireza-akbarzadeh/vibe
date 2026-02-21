import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { adminProcedure } from "@/orpc/context";
import { SubscriptionStatusSchema } from "@/orpc/models/polar";

const AdminListSubscriptionsInputSchema = z.object({
	limit: z.number().min(1).max(100).default(20),
	page: z.number().min(1).default(1),
	status: SubscriptionStatusSchema.optional(),
	productId: z.string().optional(),
});

/**
 * List all subscriptions across all users (admin only)
 */
export const listAllSubscriptions = adminProcedure
	.input(AdminListSubscriptionsInputSchema)
	.output(
		z.object({
			subscriptions: z.array(
				z.object({
					id: z.string(),
					status: z.string(),
					customerEmail: z.string().nullable(),
					productName: z.string(),
					amount: z.number(),
					currency: z.string(),
					interval: z.string().nullable(),
					currentPeriodStart: z.string(),
					currentPeriodEnd: z.string().nullable(),
					cancelAtPeriodEnd: z.boolean(),
				}),
			),
			total: z.number(),
			page: z.number(),
			limit: z.number(),
		}),
	)
	.handler(async ({ input }) => {
		try {
			const response = await polarClient.subscriptions.list({
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
					customerEmail: sub.customer?.email || null,
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
			console.error("Error fetching all subscriptions:", error);
			throw new Error("Failed to fetch subscriptions");
		}
	});
