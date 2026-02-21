import { z } from "zod";
import { db } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	deleteAllMediaAssetsInputSchema,
	deleteImageInputSchema,
} from "@/orpc/models/media-asset.input.schema";

/**
 * Delete a single image by ID
 */
export const deleteImage = adminProcedure
	.input(deleteImageInputSchema)
	.output(ApiResponseSchema(z.object({ id: z.string() })))
	.handler(async ({ input }) => {
		await prisma.image.delete({
			where: { id: input.id },
		});

		return {
			status: 200,
			message: "Image deleted successfully",
			data: { id: input.id },
		};
	});

/**
 * Delete all images for a media
 */
export const deleteAllImages = adminProcedure
	.input(deleteAllMediaAssetsInputSchema)
	.output(ApiResponseSchema(z.object({ count: z.number() })))
	.handler(async ({ input }) => {
		const result = await prisma.image.deleteMany({
			where: { mediaId: input.mediaId },
		});

		return {
			status: 200,
			message: `${result.count} images deleted successfully`,
			data: { count: result.count },
		};
	});
