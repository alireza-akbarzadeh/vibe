import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	bulkCreateImagesInputSchema,
	type CreateImageInput,
} from "@/orpc/models/media-asset.input.schema";

/**
 * Bulk create images from TMDB API response
 * Attaches images (backdrops, posters, stills) to a media item
 */
export const bulkCreateImages = adminProcedure
	.input(bulkCreateImagesInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				created: z.number(),
				skipped: z.number(),
				failed: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { mediaId, images, skipDuplicates } = input;

		// Verify media exists
		const media = await prisma.media.findUnique({
			where: { id: mediaId },
		});

		if (!media) {
			throw new Error("Media not found");
		}

		let created = 0;
		let skipped = 0;
		const errors: Array<{
			index: number;
			error: string;
			data: CreateImageInput;
		}> = [];

		// Process each image
		for (let i = 0; i < images.length; i++) {
			const image = images[i];

			try {
				await prisma.image.create({
					data: {
						mediaId,
						filePath: image.file_path,
						aspectRatio: image.aspect_ratio,
						height: image.height,
						width: image.width,
						iso6391: image.iso_639_1 ?? null,
						voteAverage: image.vote_average,
						voteCount: image.vote_count,
						type: image.type,
					},
				});
				created++;
			} catch (error: unknown) {
				const err = error as { code?: string; message?: string };
				if (err.code === "P2002" && skipDuplicates) {
					skipped++;
				} else {
					errors.push({
						index: i,
						error: err.message || "Unknown error",
						data: image,
					});
				}
			}
		}

		return {
			status: created > 0 ? 201 : 200,
			message: `Bulk image import completed: ${created} created, ${skipped} skipped, ${errors.length} failed`,
			data: {
				created,
				skipped,
				failed: errors.length,
			},
		};
	});
