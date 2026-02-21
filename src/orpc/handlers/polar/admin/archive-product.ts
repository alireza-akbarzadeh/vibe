import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { adminProcedure } from "@/orpc/context";

const ArchiveProductInputSchema = z.object({
	productId: z.string(),
});

/**
 * Archive a product (soft delete, admin only)
 */
export const archiveProduct = adminProcedure
	.input(ArchiveProductInputSchema)
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
					isArchived: true,
				},
			});

			return {
				success: true,
				message: "Product archived successfully",
			};
		} catch (error) {
			if (error instanceof Error) {
				throw errors.INTERNAL_SERVER_ERROR({
					message: error.message || "Failed to archive product",
				});
			}
			throw errors.INTERNAL_SERVER_ERROR({
				message: "Failed to archive product",
			});
		}
	});
