import { polarClient } from "@/integrations/polar/polar-client";
import { authedProcedure } from "@/orpc/context";
import { CustomerResponseSchema } from "@/orpc/models/polar";

/**
 * Get customer information for the authenticated user
 */
export const getCustomer = authedProcedure
	.output(CustomerResponseSchema.nullable())
	.handler(async ({ context, errors }) => {
		try {
			const customerId = context?.user?.customerId;

			if (!customerId) {
				return null;
			}

			const customer = await polarClient.customers.get({
				id: customerId,
			});

			// Get subscriptions count
			const subscriptions = await polarClient.subscriptions.list({
				customerId,
				limit: 100,
			});

			// Calculate total spent (sum of all subscription amounts)
			const totalSpent = subscriptions.result.items.reduce((sum, sub) => {
				const price = sub.prices?.[0];
				const priceAmount =
					price && "priceAmount" in price ? price.priceAmount : 0;
				return sum + priceAmount;
			}, 0);

			return {
				id: customer.id,
				email: customer.email,
				name: customer.name,
				subscriptionCount: subscriptions.result.pagination.totalCount || 0,
				totalSpent,
			};
		} catch (error) {
			console.error("Error fetching customer:", error);
			throw errors.NOT_FOUND({
				message: "Customer not found",
			});
		}
	});
