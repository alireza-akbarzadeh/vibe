import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db.server";
import { publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { listImagesInputSchema } from "@/orpc/models/media-asset.input.schema";
import {
	ImageListItemSchema,
	ImageSchema,
} from "@/orpc/models/media-asset.schema";

/**
 * List images for a media item
 */
export const listImages = publicProcedure
	.input(listImagesInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(ImageListItemSchema),
				total: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { mediaId, type, sortBy, sortOrder } = input;

		const where: Prisma.ImageWhereInput = {
			mediaId,
			...(type ? { type } : {}),
		};

		const orderBy: Prisma.ImageOrderByWithRelationInput =
			sortBy === "aspectRatio"
				? { aspectRatio: sortOrder }
				: { voteAverage: sortOrder };

		const [items, total] = await Promise.all([
			prisma.image.findMany({
				where,
				select: {
					id: true,
					filePath: true,
					aspectRatio: true,
					type: true,
					voteAverage: true,
				},
				orderBy,
			}),
			prisma.image.count({ where }),
		]);

		return {
			status: 200,
			message: "Images retrieved successfully",
			data: {
				items,
				total,
			},
		};
	});

/**
 * Get all images for a media grouped by type
 */
export const getMediaImages = publicProcedure
	.input(z.object({ mediaId: z.string() }))
	.output(
		ApiResponseSchema(
			z.object({
				backdrops: z.array(ImageSchema),
				posters: z.array(ImageSchema),
				stills: z.array(ImageSchema),
				logos: z.array(ImageSchema),
			}),
		),
	)
	.handler(async ({ input }) => {
		const images = await prisma.image.findMany({
			where: { mediaId: input.mediaId },
			orderBy: { voteAverage: "desc" },
		});

		// Group images by type
		const backdrops = images.filter((i) => i.type === "Backdrop");
		const posters = images.filter((i) => i.type === "Poster");
		const stills = images.filter((i) => i.type === "Still");
		const logos = images.filter((i) => i.type === "Logo");

		return {
			status: 200,
			message: "Images retrieved successfully",
			data: {
				backdrops,
				posters,
				stills,
				logos,
			},
		};
	});
