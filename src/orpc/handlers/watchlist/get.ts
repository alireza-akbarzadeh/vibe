import { z } from "zod";
import { prisma } from "@/lib/db";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";

/**
 * Get all check list items for the authenticated user
 */
export const checkWatchList = authedProcedure
	.input(
		z.object({
			mediaId: z.string(),
		}),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({
				inWatchlist: z.boolean(),
			}),
		),
	)
	.handler(async ({ input, context }) => {
		const { mediaId } = input;

		const count = await prisma.watchList.count({
			where: {
				userId: context.user.id,
				mediaId,
			},
		});

		return {
			status: 200,
			message: "Check watchlist status successfully",
			data: {
				inWatchlist: count > 0,
			},
		};
	});

/**
 * Get all watch list items for the authenticated user
 */
export const listWatchList = authedProcedure
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
					media: z.object({
						id: z.string(),
						title: z.string(),
						description: z.string(),
						thumbnail: z.string(),
						type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
					}),
				}),
			),
		),
	)
	.handler(async ({ input = { page: 1, limit: 20 }, context }) => {
		const { page, limit } = input;
		const skip = (page - 1) * limit;

		const [items, total] = await Promise.all([
			prisma.watchList.findMany({
				where: { userId: context.user.id },
				include: {
					media: {
						select: {
							id: true,
							title: true,
							description: true,
							thumbnail: true,
							type: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.watchList.count({
				where: { userId: context.user.id },
			}),
		]);

		return {
			status: 200,
			message: "Watch list retrieved successfully",
			data: {
				items: items.map((item) => ({
					id: item.id,
					userId: item.userId,
					mediaId: item.mediaId,
					createdAt: item.createdAt.toISOString(),
					media: item.media,
				})),
				pagination: {
					page,
					limit,
					total,
				},
			},
		};
	});
