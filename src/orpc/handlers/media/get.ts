import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { listMediaInputSchema } from "@/orpc/models/media.input.schema";
import {
	MediaItemSchema,
	MediaListItemSchema,
} from "@/orpc/models/media.schema";

/* ---------------------------- Get Media by ID ---------------------------- */
// PUBLIC - Allow browsing details, subscription required for playback
export const getMedia = publicProcedure
	.input(z.object({ id: z.string() }))
	.output(ApiResponseSchema(MediaItemSchema))
	.handler(async ({ input }) => {
		const media = await prisma.media.findUnique({
			where: { id: input.id },
			include: {
				genres: { include: { genre: true } },
				creators: { include: { creator: true } },
				collection: {
					include: {
						media: {
							select: { id: true, title: true, thumbnail: true, type: true },
							orderBy: { sortOrder: "asc" },
						},
					},
				},
			},
		});

		if (!media)
			throw { code: "NOT_FOUND", status: 404, message: "Media not found" };

		const parsedMedia = MediaItemSchema.parse(media);

		return {
			status: 200,
			message: "Media retrieved successfully",
			data: parsedMedia,
		};
	});

export const listMedia = publicProcedure
	.input(listMediaInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(MediaListItemSchema),
				pagination: z.object({
					page: z.number(),
					limit: z.number(),
					total: z.number(),
					totalPages: z.number(),
				}),
			}),
		),
	)
	.handler(async ({ input, context }) => {
		const {
			page,
			limit,
			search,
			category,
			type,
			collectionId,
			genreIds,
			creatorIds,
			status,
			releaseYearFrom,
			releaseYearTo,
			sortBy,
		} = input;

		const skip = (page - 1) * limit;

		/* ------------------------------------------------------------------ */
		/*                          CATEGORY FILTERS                          */
		/* ------------------------------------------------------------------ */

		const categoryFilters = await (async () => {
			const where: Prisma.MediaWhereInput = {};
			let orderBy: Prisma.MediaOrderByWithRelationInput | undefined;

			if (!category) {
				return { where, orderBy };
			}

			switch (category) {
				case "ALL":
					// No additional filters - show all media
					break;

				case "MOVIES":
					where.type = "MOVIE";
					break;

				case "SERIES":
					where.collection = {
						type: "SERIES",
					};
					break;

				case "ANIMATION": {
					// Find Animation genre
					const animationGenre = await prisma.genre.findFirst({
						where: { name: { equals: "Animation", mode: "insensitive" } },
					});
					if (animationGenre) {
						where.genres = {
							some: { genreId: animationGenre.id },
						};
					}
					break;
				}

				case "TRENDING": {
					// Trending: Recent (last 30 days) + high engagement
					const thirtyDaysAgo = new Date();
					thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

					where.createdAt = { gte: thirtyDaysAgo };
					// Order by favorites + views count (we'll do this with a subquery later)
					// For now, order by createdAt desc as proxy for trending
					orderBy = { createdAt: "desc" };
					break;
				}

				case "RECENT":
					// Recent releases
					orderBy = { createdAt: "desc" };
					break;

				case "MY_LIST": {
					// User's favorites
					if (!context?.user?.id) {
						// If not authenticated, return empty list
						return {
							where: {},
							orderBy: undefined,
							isEmpty: true,
						};
					}

					where.favorites = {
						some: { userId: context.user.id },
					};
					orderBy = {
						favorites: {
							_count: "desc",
						},
					};
					break;
				}
			}

			return { where, orderBy, isEmpty: false };
		})();

		// Early return for MY_LIST when not authenticated
		if (categoryFilters.isEmpty) {
			return {
				status: 200,
				message: "Media list retrieved successfully",
				data: {
					items: [],
					pagination: {
						page,
						limit,
						total: 0,
						totalPages: 0,
					},
				},
			};
		}

		/* ------------------------------------------------------------------ */
		/*                               FILTERS                              */
		/* ------------------------------------------------------------------ */

		const where: Prisma.MediaWhereInput = {
			status: { in: status },
			type,
			collectionId,
			...categoryFilters.where,
			AND: [
				search
					? {
							OR: [
								{ title: { contains: search, mode: "insensitive" } },
								{
									description: {
										contains: search,
										mode: "insensitive",
									},
								},
							],
						}
					: {},
				releaseYearFrom || releaseYearTo
					? {
							releaseYear: {
								gte: releaseYearFrom,
								lte: releaseYearTo,
							},
						}
					: {},
				genreIds?.length
					? {
							genres: {
								some: { genreId: { in: genreIds } },
							},
						}
					: {},
				creatorIds?.length
					? {
							creators: {
								some: { creatorId: { in: creatorIds } },
							},
						}
					: {},
			],
		};

		/* ------------------------------------------------------------------ */
		/*                                SORT                                */
		/* ------------------------------------------------------------------ */

		const orderBy: Prisma.MediaOrderByWithRelationInput =
			categoryFilters.orderBy ||
			(sortBy === "NEWEST"
				? { createdAt: "desc" }
				: sortBy === "OLDEST"
					? { createdAt: "asc" }
					: sortBy === "TITLE"
						? { title: "asc" }
						: { sortOrder: "asc" });

		/* ------------------------------------------------------------------ */
		/*                           QUERY (PARALLEL)                         */
		/* ------------------------------------------------------------------ */

		const [items, total] = await Promise.all([
			prisma.media.findMany({
				where,
				orderBy,
				skip,
				take: limit,
				select: {
					id: true,
					title: true,
					description: true,
					thumbnail: true,
					type: true,
					duration: true,
					releaseYear: true,
					createdAt: true,
					rating: true,
					reviewCount: true,
					criticalScore: true,
					viewCount: true,
					collection: {
						select: {
							id: true,
							title: true,
							type: true,
						},
					},
					genres: {
						select: {
							genre: {
								select: { id: true, name: true },
							},
						},
					},
					creators: {
						select: {
							role: true,
							creator: {
								select: {
									id: true,
									name: true,
									image: true,
								},
							},
						},
					},
				},
			}),
			prisma.media.count({ where }),
		]);

		return {
			status: 200,
			message: "Media list retrieved successfully",
			data: {
				items: items.map((m) => MediaListItemSchema.parse(m)),
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
		};
	});

/* ---------------------------- Trending search terms ---------------------------- */
const trendingSearchesInputSchema = z.object({
	limit: z.number().min(1).max(20).default(8),
});

export const getTrendingSearches = publicProcedure
	.input(trendingSearchesInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(MediaListItemSchema),
			}),
		),
	)
	.handler(async ({ input }) => {
		const items = await prisma.media.findMany({
			where: { status: "PUBLISHED" },
			orderBy: [
				{ viewCount: "desc" },
				{ rating: "desc" },
				{ createdAt: "desc" },
			],
			take: input.limit,
			select: {
				id: true,
				title: true,
				description: true,
				thumbnail: true,
				type: true,
				duration: true,
				releaseYear: true,
				createdAt: true,
				rating: true,
				reviewCount: true,
				criticalScore: true,
				viewCount: true,
				collection: {
					select: {
						id: true,
						title: true,
						type: true,
					},
				},
				genres: {
					select: {
						genre: {
							select: { id: true, name: true, description: true },
						},
					},
				},
				creators: {
					select: {
						role: true,
						creator: {
							select: {
								id: true,
								name: true,
								bio: true,
								image: true,
								birthDate: true,
							},
						},
					},
				},
			},
		});

		return {
			status: 200,
			message: "Trending searches retrieved successfully",
			data: {
				items: items.map((m) => MediaListItemSchema.parse(m)),
			},
		};
	});
