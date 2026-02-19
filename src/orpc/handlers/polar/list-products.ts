import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { authedProcedure } from "@/orpc/context";
import { ListQuerySchema, ProductResponseSchema } from "../../models/polar";

/**
 * Get all available products
 */
export const listProducts = authedProcedure
	.input(ListQuerySchema)
	.output(
		z.object({
			products: z.array(ProductResponseSchema),
			total: z.number(),
			page: z.number(),
			limit: z.number(),
		}),
	)
	.handler(async ({ input }) => {
		try {
			const response = await polarClient.products.list({
				limit: input.limit,
				page: input.page,
				isArchived: false,
			});

			const products = response.result.items.map((product) => {
				const price = product.prices[0];
				const priceAmount = "priceAmount" in price ? price.priceAmount : 0;
				const priceCurrency =
					"priceCurrency" in price ? price.priceCurrency : "USD";
				const recurringInterval =
					"recurringInterval" in price ? price.recurringInterval : null;

				return {
					id: product.id,
					name: product.name,
					description: product.description,
					priceAmount,
					priceCurrency,
					recurringInterval: recurringInterval as
						| "day"
						| "week"
						| "month"
						| "year"
						| null,
					isRecurring: product.isRecurring,
				};
			});

			return {
				products,
				total: response.result.pagination.totalCount || 0,
				page: input.page,
				limit: input.limit,
			};
		} catch (error) {
			console.error("Error fetching products:", error);
			throw new Error("Failed to fetch products");
		}
	});
