import { z } from "zod";
import { prisma } from "@/lib/db";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";

const dashboardMediaSchema = z.object({
	id: z.string(),
	title: z.string(),
	thumbnail: z.string(),
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
});

const dashboardStatsSchema = z.object({
	favoritesCount: z.number(),
	watchlistCount: z.number(),
	historyCount: z.number(),
	reviewsCount: z.number(),
	recentFavorites: z.array(dashboardMediaSchema),
	recentWatchlist: z.array(dashboardMediaSchema),
	recentHistory: z.array(
		z.object({
			id: z.string(),
			mediaId: z.string(),
			progress: z.number(),
			completed: z.boolean(),
			viewedAt: z.string(),
			media: dashboardMediaSchema,
		}),
	),
	memberSince: z.string(),
});

/**
 * Get the authenticated user's library dashboard stats
 */
export const getLibraryDashboard = authedProcedure
	.input(z.void())
	.output(ResponseSchema.ApiResponseSchema(dashboardStatsSchema))
	.handler(async ({ context }) => {
		const userId = context.user.id;

		// Get the user's default profile for viewing history
		const profile = await prisma.profile.findFirst({
			where: { userId },
			orderBy: { createdAt: "asc" },
		});

		const [
			favoritesCount,
			watchlistCount,
			historyCount,
			reviewsCount,
			recentFavorites,
			recentWatchlist,
			recentHistory,
		] = await Promise.all([
			prisma.favorite.count({ where: { userId } }),
			prisma.watchList.count({ where: { userId } }),
			profile
				? prisma.viewingHistory.count({
						where: { profileId: profile.id },
					})
				: Promise.resolve(0),
			prisma.userReview.count({ where: { userId } }),
			prisma.favorite.findMany({
				where: { userId },
				include: {
					media: {
						select: {
							id: true,
							title: true,
							thumbnail: true,
							type: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				take: 5,
			}),
			prisma.watchList.findMany({
				where: { userId },
				include: {
					media: {
						select: {
							id: true,
							title: true,
							thumbnail: true,
							type: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				take: 5,
			}),
			profile
				? prisma.viewingHistory.findMany({
						where: { profileId: profile.id },
						include: {
							media: {
								select: {
									id: true,
									title: true,
									thumbnail: true,
									type: true,
								},
							},
						},
						orderBy: { viewedAt: "desc" },
						take: 5,
					})
				: Promise.resolve([]),
		]);

		return {
			status: 200,
			message: "Dashboard stats retrieved",
			data: {
				favoritesCount,
				watchlistCount,
				historyCount,
				reviewsCount,
				recentFavorites: recentFavorites.map((f) => f.media),
				recentWatchlist: recentWatchlist.map((w) => w.media),
				recentHistory: recentHistory.map((h) => ({
					id: h.id,
					mediaId: h.mediaId,
					progress: h.progress,
					completed: h.completed,
					viewedAt: h.viewedAt.toISOString(),
					media: h.media,
				})),
				memberSince: context.user.createdAt.toISOString(),
			},
		};
	});
