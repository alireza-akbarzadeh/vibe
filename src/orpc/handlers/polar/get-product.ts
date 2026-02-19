import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { authedProcedure } from "@/orpc/context";
import { ProductResponseSchema } from "../../models/polar";

/**
 * Get a specific product by ID
 */
export const getProduct = authedProcedure
	.input(z.object({ productId: z.string() }))
	.output(ProductResponseSchema)
	.handler(async ({ input, errors }) => {
		try {
			const product = await polarClient.products.get({
				id: input.productId,
			});

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
		} catch (error) {
			console.error("Error fetching product:", error);
			throw errors.NOT_FOUND({
				message: "Product not found",
			});
		}
	});
