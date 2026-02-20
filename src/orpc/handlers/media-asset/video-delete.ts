import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	deleteAllMediaAssetsInputSchema,
	deleteVideoInputSchema,
} from "@/orpc/models/media-asset.input.schema";

/**
 * Delete a single video by ID
 */
export const deleteVideo = adminProcedure
	.input(deleteVideoInputSchema)
	.output(ApiResponseSchema(z.object({ id: z.string() })))
	.handler(async ({ input }) => {
		await prisma.video.delete({
			where: { id: input.id },
		});

		return {
			status: 200,
			message: "Video deleted successfully",
			data: { id: input.id },
		};
	});

/**
 * Delete all videos for a media
 */
export const deleteAllVideos = adminProcedure
	.input(deleteAllMediaAssetsInputSchema)
	.output(ApiResponseSchema(z.object({ count: z.number() })))
	.handler(async ({ input }) => {
		const result = await prisma.video.deleteMany({
			where: { mediaId: input.mediaId },
		});

		return {
			status: 200,
			message: `${result.count} videos deleted successfully`,
			data: { count: result.count },
		};
	});
