import { z } from "zod";
import { prisma } from "@/lib/db";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { viewingHistoryQueryInput } from "@/orpc/models/viewing-history";

/**
 * Get viewing history for a specific profile
 */
export const getViewingHistory = authedProcedure
	.input(
		viewingHistoryQueryInput.extend({
			page: z.number().min(1).default(1),
			limit: z.number().min(1).max(100).default(20),
		}),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			ResponseSchema.PaginatedOutput(
				z.object({
					id: z.string(),
					profileId: z.string(),
					mediaId: z.string(),
					progress: z.number(),
					completed: z.boolean(),
					viewedAt: z.string(),
					media: z.object({
						id: z.string(),
						title: z.string(),
						description: z.string(),
						thumbnail: z.string(),
						type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
						duration: z.number(),
					}),
				}),
			),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const { profileId, page, limit } = input;
		const skip = (page - 1) * limit;

		// Verify profile belongs to user
		const profile = await prisma.profile.findFirst({
			where: {
				id: profileId,
				userId: context.user.id,
			},
		});

		if (!profile) {
			throw errors.FORBIDDEN({ message: "Profile does not belong to you" });
		}

		const [items, total] = await Promise.all([
			prisma.viewingHistory.findMany({
				where: { profileId },
				include: {
					media: {
						select: {
							id: true,
							title: true,
							description: true,
							thumbnail: true,
							type: true,
							duration: true,
						},
					},
				},
				orderBy: { viewedAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.viewingHistory.count({
				where: { profileId },
			}),
		]);

		return {
			status: 200,
			message: "Viewing history retrieved successfully",
			data: {
				items: items.map((item) => ({
					id: item.id,
					profileId: item.profileId,
					mediaId: item.mediaId,
					progress: item.progress,
					completed: item.completed,
					viewedAt: item.viewedAt.toISOString(),
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

/**
 * Get continue watching list for a profile (incomplete items)
 */
export const getContinueWatching = authedProcedure
	.input(
		z.object({
			profileId: z.string(),
			limit: z.number().min(1).max(50).default(10),
		}),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.array(
				z.object({
					id: z.string(),
					profileId: z.string(),
					mediaId: z.string(),
					progress: z.number(),
					viewedAt: z.string(),
					media: z.object({
						id: z.string(),
						title: z.string(),
						thumbnail: z.string(),
						type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
						duration: z.number(),
					}),
				}),
			),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const { profileId, limit } = input;

		// Verify profile belongs to user
		const profile = await prisma.profile.findFirst({
			where: {
				id: profileId,
				userId: context.user.id,
			},
		});

		if (!profile) {
			throw errors.FORBIDDEN({ message: "Profile does not belong to you" });
		}

		const items = await prisma.viewingHistory.findMany({
			where: {
				profileId,
				completed: false,
				progress: { gt: 0 },
			},
			include: {
				media: {
					select: {
						id: true,
						title: true,
						thumbnail: true,
						type: true,
						duration: true,
					},
				},
			},
			orderBy: { viewedAt: "desc" },
			take: limit,
		});

		return {
			status: 200,
			message: "Continue watching retrieved successfully",
			data: items.map((item) => ({
				id: item.id,
				profileId: item.profileId,
				mediaId: item.mediaId,
				progress: item.progress,
				viewedAt: item.viewedAt.toISOString(),
				media: item.media,
			})),
		};
	});
