import { prisma } from "@/lib/db.server";
import { authedProcedure, publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	genreBasedInputSchema,
	recommendationOutputSchema,
	trendingInputSchema,
} from "@/orpc/models/recommendation";

/* -------------- Genre-Based Recommendations (Based on History) ------------- */
export const getGenreBasedRecommendations = authedProcedure
	.route({ method: "GET" })
	.input(genreBasedInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input, context, errors }) => {
		const { profileId, limit, excludeWatched } = input;

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

		// Get viewing history for this profile
		const viewingHistory = await prisma.viewingHistory.findMany({
			where: { profileId },
			include: {
				media: {
					include: {
						genres: {
							include: {
								genre: true,
							},
						},
					},
				},
			},
		});

		if (viewingHistory.length === 0) {
			return {
				status: 200,
				message: "No recommendations available yet. Start watching!",
				data: {
					items: [],
					reason: "No viewing history found",
				},
			};
		}

		// Extract genre IDs from watched media
		const genreMap = new Map<string, number>();
		viewingHistory.forEach((history) => {
			history.media.genres.forEach((mg) => {
				genreMap.set(mg.genreId, (genreMap.get(mg.genreId) || 0) + 1);
			});
		});

		// Get top genres
		const topGenres = Array.from(genreMap.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
			.map(([genreId]) => genreId);

		if (topGenres.length === 0) {
			return {
				status: 200,
				message: "No genre information found",
				data: {
					items: [],
					reason: "No genres found in viewing history",
				},
			};
		}

		// Get genre names for reason string
		const genres = await prisma.genre.findMany({
			where: { id: { in: topGenres } },
			select: { name: true },
		});

		// Get watched media IDs for exclusion
		const watchedMediaIds = excludeWatched
			? viewingHistory.map((h) => h.mediaId)
			: [];

		// Find recommendations
		const recommendations = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				id: { notIn: watchedMediaIds },
				genres: {
					some: {
						genreId: { in: topGenres },
					},
				},
			},
			include: {
				genres: {
					include: {
						genre: true,
					},
				},
				creators: {
					include: {
						creator: true,
					},
				},
			},
			orderBy: [{ rating: "desc" }, { viewCount: "desc" }],
			take: limit,
		});

		return {
			status: 200,
			message: "Recommendations retrieved successfully",
			data: {
				items: recommendations,
				reason: `Based on ${genres.map((g) => g.name).join(", ")} genres you've watched`,
			},
		};
	});

/* ---------------------------- Trending Media ---------------------------- */
export const getTrending = publicProcedure
	.input(trendingInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { type, limit, days, page } = input;
		const skip = (page - 1) * limit;

		const dateThreshold = new Date();
		dateThreshold.setDate(dateThreshold.getDate() - days);

		// Find media with most views - sorted by viewCount and rating
		// TODO: Add time-based filtering when we track view timestamps
		const trending = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				...(type && { type }),
				viewCount: { gt: 0 }, // Has been viewed
			},
			include: {
				genres: {
					include: {
						genre: true,
					},
				},
				creators: {
					include: {
						creator: true,
					},
				},
			},
			orderBy: [{ viewCount: "desc" }, { rating: "desc" }],
			skip,
			take: limit,
		});

		return {
			status: 200,
			message: "Trending media retrieved successfully",
			data: {
				items: trending,
				reason: `Trending in the last ${days} days`,
			},
		};
	});

/* ------------------------- Top Rated Media ------------------------- */
export const getTopRated = publicProcedure
	.input(trendingInputSchema.omit({ days: true }))
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { type, limit, page } = input;
		const skip = (page - 1) * limit;

		const topRated = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				...(type && { type }),
				reviewCount: { gte: 5 }, // At least 5 reviews
			},
			include: {
				genres: {
					include: {
						genre: true,
					},
				},
				creators: {
					include: {
						creator: true,
					},
				},
			},
			orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
			skip,
			take: limit,
		});

		return {
			status: 200,
			message: "Top rated media retrieved successfully",
			data: {
				items: topRated,
				reason: "Highest rated by users",
			},
		};
	});
