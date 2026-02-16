import { z } from "zod";
import { prisma } from "@/lib/db";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { MediaListItemSchema } from "@/orpc/models/media.schema";

/**
 * Get all favorites for the authenticated user
 */
export const listFavorites = authedProcedure
	.input(
		z
			.object({
				page: z.number().min(1).default(1),
				limit: z.number().min(1).max(100).default(20),
			})
			.optional(),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			ResponseSchema.PaginatedOutput(
				z.object({
					id: z.string(),
					userId: z.string(),
					mediaId: z.string(),
					createdAt: z.string(),
					media: MediaListItemSchema,
				}),
			),
		),
	)
	.handler(async ({ input = { page: 1, limit: 20 }, context }) => {
		const { page, limit } = input;
		const skip = (page - 1) * limit;

		const [favorites, total] = await Promise.all([
			prisma.favorite.findMany({
				where: { userId: context.user.id },
				include: {
					media: {
						include: {
							genres: { include: { genre: true } },
							creators: { include: { creator: true } },
							collection: {
								select: { id: true, title: true, type: true },
							},
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.favorite.count({
				where: { userId: context.user.id },
			}),
		]);

		return {
			status: 200,
			message: "Favorites retrieved successfully",
			data: {
				items: favorites.map((f) => ({
					id: f.id,
					userId: f.userId,
					mediaId: f.mediaId,
					createdAt: f.createdAt.toISOString(),
					media: f.media as any,
				})),
				pagination: {
					page,
					limit,
					total,
				},
			},
		};
	});
