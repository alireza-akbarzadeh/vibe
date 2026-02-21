import { PresentmentCurrency } from "@polar-sh/sdk/models/components/presentmentcurrency.js";
import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { logger } from "@/lib/logger";
import { adminProcedure } from "@/orpc/context";

const ProductPriceFixedCreateSchema = z.object({
	priceAmount: z.number().min(0),
	priceCurrency: z
		.nativeEnum(PresentmentCurrency)
		.default(PresentmentCurrency.Usd),
});

const CreateProductInputSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(500).optional(),
	recurringInterval: z.enum(["day", "week", "month", "year"]),
	recurringIntervalCount: z.number().min(1).default(1),
	prices: z.array(ProductPriceFixedCreateSchema).min(1),
	trialInterval: z.enum(["day", "week", "month", "year"]).optional().nullable(),
	trialIntervalCount: z.number().min(1).optional().nullable(),
});

/**
 * Create a new subscription product (admin only)
 */
export const createProduct = adminProcedure
	.input(CreateProductInputSchema)
	.output(
		z.object({
			success: z.boolean(),
			productId: z.string(),
			message: z.string(),
		}),
	)
	.handler(async ({ input, errors }) => {
		try {
			const product = await polarClient.products.create({
				name: input.name,
				description: input.description || null,
				recurringInterval: input.recurringInterval,
				recurringIntervalCount: input.recurringIntervalCount,
				prices: input.prices.map((price) => ({
					type: "fixed" as const,
					amountType: "fixed" as const,
					priceAmount: price.priceAmount,
					priceCurrency: price.priceCurrency,
				})),
				...(input.trialInterval && {
					trialInterval: input.trialInterval,
				}),
				...(input.trialIntervalCount && {
					trialIntervalCount: input.trialIntervalCount,
				}),
			});

			return {
				success: true,
				productId: product.id,
				message: "Product created successfully",
			};
		} catch (error: any) {
			logger.info("Error creating product:", error);
			throw errors.INTERNAL_SERVER_ERROR({
				message: error.message || "Failed to create product",
			});
		}
	});
