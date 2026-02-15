import { prisma } from "@/lib/db";
import { publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	latestReleasesInputSchema,
	popularSeriesInputSchema,
} from "@/orpc/models/content";
import { recommendationOutputSchema } from "@/orpc/models/recommendation";

/* ---------------------------- Latest Releases ---------------------------- */
export const getLatestReleases = publicProcedure
	.route({ method: "GET" })
	.input(latestReleasesInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { type, limit } = input;

		const latestReleases = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				...(type && { type }),
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
				collection: {
					select: {
						id: true,
						title: true,
						type: true,
					},
				},
			},
			orderBy: [
				{ createdAt: "desc" }, // Most recent first
				{ releaseYear: "desc" },
			],
			take: limit,
		});

		return {
			status: 200,
			message: "Latest releases retrieved successfully",
			data: {
				items: latestReleases,
				reason: "Recently added content",
			},
		};
	});

/* ---------------------------- Popular Series ---------------------------- */
export const getPopularSeries = publicProcedure
	.route({ method: "GET" })
	.input(popularSeriesInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { limit } = input;

		// Get all series/albums and calculate total views per collection
		const collections = await prisma.collection.findMany({
			where: {
				type: { in: ["SERIES", "ALBUM"] },
				media: {
					some: {
						status: "PUBLISHED",
					},
				},
			},
			include: {
				media: {
					where: { status: "PUBLISHED" },
					select: {
						viewCount: true,
						rating: true,
					},
				},
			},
		});

		// Calculate total views and average rating for each collection
		const collectionsWithStats = collections.map((col) => {
			const totalViews = col.media.reduce((sum, m) => sum + m.viewCount, 0);
			const avgRating =
				col.media.reduce((sum, m) => sum + (m.rating || 0), 0) /
				col.media.length;
			return { ...col, totalViews, avgRating };
		});

		// Sort by total views and rating
		const sortedCollections = collectionsWithStats
			.sort((a, b) => {
				if (b.totalViews !== a.totalViews) {
					return b.totalViews - a.totalViews;
				}
				return b.avgRating - a.avgRating;
			})
			.slice(0, limit);

		// Get full media details for sorted collections
		const collectionIds = sortedCollections.map((c) => c.id);
		const mediaItems = await prisma.media.findMany({
			where: {
				collectionId: { in: collectionIds },
				status: "PUBLISHED",
				sortOrder: 0, // First episode/track only
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
				collection: {
					select: {
						id: true,
						title: true,
						type: true,
					},
				},
			},
		});

		// Sort mediaItems by collection popularity order
		const sortedItems = mediaItems.sort((a, b) => {
			const aIndex = collectionIds.indexOf(a.collectionId || "");
			const bIndex = collectionIds.indexOf(b.collectionId || "");
			return aIndex - bIndex;
		});

		return {
			status: 200,
			message: "Popular series retrieved successfully",
			data: {
				items: sortedItems,
				reason: "Most viewed series and albums",
			},
		};
	});

/* ---------------------------- Animations ---------------------------- */
export const getAnimations = publicProcedure
	.route({ method: "GET" })
	.input(latestReleasesInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { type, limit } = input;

		// Find Animation genre
		const animationGenre = await prisma.genre.findFirst({
			where: {
				OR: [
					{ name: { equals: "Animation", mode: "insensitive" } },
					{ name: { equals: "Anime", mode: "insensitive" } },
				],
			},
		});

		if (!animationGenre) {
			return {
				status: 200,
				message: "No animation genre found",
				data: {
					items: [],
					reason: "Animation genre not configured",
				},
			};
		}

		const animations = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				...(type && { type }),
				genres: {
					some: {
						genreId: animationGenre.id,
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
				collection: {
					select: {
						id: true,
						title: true,
						type: true,
					},
				},
			},
			orderBy: [
				{ viewCount: "desc" },
				{ rating: "desc" },
				{ createdAt: "desc" },
			],
			take: limit,
		});

		return {
			status: 200,
			message: "Animations retrieved successfully",
			data: {
				items: animations,
				reason: "Popular animated content",
			},
		};
	});

/* ---------------------------- TV Series ---------------------------- */
export const getTVSeries = publicProcedure
	.route({ method: "GET" })
	.input(popularSeriesInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { limit } = input;

		const tvSeries = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				type: "EPISODE",
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
				collection: {
					select: {
						id: true,
						title: true,
						type: true,
					},
				},
			},
			orderBy: [{ viewCount: "desc" }, { rating: "desc" }],
			take: limit,
		});

		return {
			status: 200,
			message: "TV series retrieved successfully",
			data: {
				items: tvSeries,
				reason: "Popular TV series",
			},
		};
	});

/* ---------------------------- Horror Movies ---------------------------- */
export const getHorrorMovies = publicProcedure
	.route({ method: "GET" })
	.input(latestReleasesInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { limit } = input;

		const horrorGenre = await prisma.genre.findFirst({
			where: {
				name: { equals: "Horror", mode: "insensitive" },
			},
		});

		if (!horrorGenre) {
			return {
				status: 200,
				message: "No horror genre found",
				data: {
					items: [],
					reason: "Horror genre not configured",
				},
			};
		}

		const horrorMovies = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				type: "MOVIE",
				genres: {
					some: {
						genreId: horrorGenre.id,
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
				collection: {
					select: {
						id: true,
						title: true,
						type: true,
					},
				},
			},
			orderBy: [{ viewCount: "desc" }, { rating: "desc" }],
			take: limit,
		});

		return {
			status: 200,
			message: "Horror movies retrieved successfully",
			data: {
				items: horrorMovies,
				reason: "Thrilling horror movies",
			},
		};
	});

/* ---------------------------- Comedy Movies ---------------------------- */
export const getComedyMovies = publicProcedure
	.route({ method: "GET" })
	.input(latestReleasesInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { limit } = input;

		const comedyGenre = await prisma.genre.findFirst({
			where: {
				name: { equals: "Comedy", mode: "insensitive" },
			},
		});

		if (!comedyGenre) {
			return {
				status: 200,
				message: "No comedy genre found",
				data: {
					items: [],
					reason: "Comedy genre not configured",
				},
			};
		}

		const comedyMovies = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				type: "MOVIE",
				genres: {
					some: {
						genreId: comedyGenre.id,
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
				collection: {
					select: {
						id: true,
						title: true,
						type: true,
					},
				},
			},
			orderBy: [{ viewCount: "desc" }, { rating: "desc" }],
			take: limit,
		});

		return {
			status: 200,
			message: "Comedy movies retrieved successfully",
			data: {
				items: comedyMovies,
				reason: "Hilarious comedy movies",
			},
		};
	});

/* ---------------------------- Romance Movies ---------------------------- */
export const getRomanceMovies = publicProcedure
	.route({ method: "GET" })
	.input(latestReleasesInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { limit } = input;

		const romanceGenre = await prisma.genre.findFirst({
			where: {
				name: { equals: "Romance", mode: "insensitive" },
			},
		});

		if (!romanceGenre) {
			return {
				status: 200,
				message: "No romance genre found",
				data: {
					items: [],
					reason: "Romance genre not configured",
				},
			};
		}

		const romanceMovies = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				type: "MOVIE",
				genres: {
					some: {
						genreId: romanceGenre.id,
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
				collection: {
					select: {
						id: true,
						title: true,
						type: true,
					},
				},
			},
			orderBy: [{ viewCount: "desc" }, { rating: "desc" }],
			take: limit,
		});

		return {
			status: 200,
			message: "Romance movies retrieved successfully",
			data: {
				items: romanceMovies,
				reason: "Heartwarming romance movies",
			},
		};
	});

/* ---------------------------- Top IMDB Rated ---------------------------- */
export const getTopIMDB = publicProcedure
	.route({ method: "GET" })
	.input(latestReleasesInputSchema)
	.output(ApiResponseSchema(recommendationOutputSchema))
	.handler(async ({ input }) => {
		const { type, limit } = input;

		const topRated = await prisma.media.findMany({
			where: {
				status: "PUBLISHED",
				...(type && { type }),
				rating: { gte: 7.0 }, // IMDB rating >= 7.0
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
				collection: {
					select: {
						id: true,
						title: true,
						type: true,
					},
				},
			},
			orderBy: [{ rating: "desc" }, { viewCount: "desc" }],
			take: limit,
		});

		return {
			status: 200,
			message: "Top rated content retrieved successfully",
			data: {
				items: topRated,
				reason: "Highest rated on IMDB",
			},
		};
	});
