import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { logger } from "@/lib/logger";
import { adminProcedure } from "@/orpc/context";

const UpdateProductInputSchema = z.object({
	productId: z.string(),
	name: z.string().min(1).max(100).optional(),
	description: z.string().max(500).optional().nullable(),
});

/**
 * Update an existing product (admin only)
 */
export const updateProduct = adminProcedure
	.input(UpdateProductInputSchema)
	.output(
		z.object({
			success: z.boolean(),
			message: z.string(),
		}),
	)
	.handler(async ({ input, errors }) => {
		try {
			await polarClient.products.update({
				id: input.productId,
				productUpdate: {
					...(input.name && { name: input.name }),
					...(typeof input.description !== "undefined" && {
						description: input.description,
					}),
				},
			});

			return {
				success: true,
				message: "Product updated successfully",
			};
		} catch (error) {
			if (error instanceof Error) {
				logger.error("Error updating product:", error);
				throw errors.INTERNAL_SERVER_ERROR({
					message: error.message || "Failed to update product",
				});
			}
			throw errors.INTERNAL_SERVER_ERROR({
				message: "Failed to update product",
			});
		}
	});
