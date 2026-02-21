import type { VideoType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	bulkCreateVideosInputSchema,
	type CreateVideoInput,
} from "@/orpc/models/media-asset.input.schema";

/**
 * Map TMDB video type to our VideoType enum
 */
function mapVideoType(tmdbType: string): VideoType {
	const typeMap: Record<string, VideoType> = {
		Trailer: "Trailer",
		Teaser: "Teaser",
		Clip: "Clip",
		Featurette: "Featurette",
		"Behind the Scenes": "BehindTheScenes",
		Bloopers: "Bloopers",
		Recap: "Recap",
		Opening: "Opening",
	};

	return typeMap[tmdbType] || "Clip";
}

/**
 * Bulk create videos from TMDB API response
 * Attaches videos (trailers, teasers, etc.) to a media item
 */
export const bulkCreateVideos = adminProcedure
	.input(bulkCreateVideosInputSchema)
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
		const { mediaId, videos, skipDuplicates } = input;

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
			data: CreateVideoInput;
		}> = [];

		// Process each video
		for (let i = 0; i < videos.length; i++) {
			const video = videos[i];

			try {
				await prisma.video.create({
					data: {
						mediaId,
						tmdbId: video.id,
						iso6391: video.iso_639_1 ?? null,
						iso31661: video.iso_3166_1 ?? null,
						name: video.name,
						key: video.key,
						site: video.site,
						size: video.size,
						type: mapVideoType(video.type),
						official: video.official,
						publishedAt: new Date(video.published_at),
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
						data: video,
					});
				}
			}
		}

		return {
			status: created > 0 ? 201 : 200,
			message: `Bulk video import completed: ${created} created, ${skipped} skipped, ${errors.length} failed`,
			data: {
				created,
				skipped,
				failed: errors.length,
			},
		};
	});
