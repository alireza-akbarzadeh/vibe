import { z } from "zod";
import type { Prisma, VideoType } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { listVideosInputSchema } from "@/orpc/models/media-asset.input.schema";
import {
	VideoListItemSchema,
	VideoSchema,
} from "@/orpc/models/media-asset.schema";

/**
 * List videos for a media item
 */
export const listVideos = publicProcedure
	.input(listVideosInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(VideoListItemSchema),
				total: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { mediaId, type, official, sortBy, sortOrder } = input;

		const where: Prisma.VideoWhereInput = {
			mediaId,
			...(type ? { type: type as VideoType } : {}),
			...(official !== undefined ? { official } : {}),
		};

		const orderBy: Prisma.VideoOrderByWithRelationInput =
			sortBy === "name"
				? { name: sortOrder }
				: sortBy === "type"
					? { type: sortOrder }
					: { publishedAt: sortOrder };

		const [items, total] = await Promise.all([
			prisma.video.findMany({
				where,
				select: {
					id: true,
					name: true,
					key: true,
					site: true,
					type: true,
					official: true,
					publishedAt: true,
				},
				orderBy,
			}),
			prisma.video.count({ where }),
		]);

		return {
			status: 200,
			message: "Videos retrieved successfully",
			data: {
				items,
				total,
			},
		};
	});

/**
 * Get all videos for a media with full details
 */
export const getMediaVideos = publicProcedure
	.input(z.object({ mediaId: z.string() }))
	.output(
		ApiResponseSchema(
			z.object({
				trailers: z.array(VideoSchema),
				teasers: z.array(VideoSchema),
				clips: z.array(VideoSchema),
				featurettes: z.array(VideoSchema),
				other: z.array(VideoSchema),
			}),
		),
	)
	.handler(async ({ input }) => {
		const videos = await prisma.video.findMany({
			where: { mediaId: input.mediaId },
			orderBy: [{ official: "desc" }, { publishedAt: "desc" }],
		});

		// Group videos by type
		const trailers = videos.filter((v) => v.type === "Trailer");
		const teasers = videos.filter((v) => v.type === "Teaser");
		const clips = videos.filter((v) => v.type === "Clip");
		const featurettes = videos.filter((v) => v.type === "Featurette");
		const other = videos.filter(
			(v) =>
				!["Trailer", "Teaser", "Clip", "Featurette"].includes(v.type as string),
		);

		return {
			status: 200,
			message: "Videos retrieved successfully",
			data: {
				trailers,
				teasers,
				clips,
				featurettes,
				other,
			},
		};
	});
