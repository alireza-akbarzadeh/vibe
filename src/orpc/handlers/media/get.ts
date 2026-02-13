import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { publicProcedure, subscribedProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { listMediaInputSchema } from "@/orpc/models/media.input.schema";
import {
	MediaItemSchema,
	MediaListItemSchema,
} from "@/orpc/models/media.schema";

/* ---------------------------- Get Media by ID ---------------------------- */
// SUBSCRIBED ONLY - Watch page, details
export const getMedia = subscribedProcedure
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
	.handler(async ({ input }) => {
		const {
			page,
			limit,
			search,
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
		/*                               FILTERS                              */
		/* ------------------------------------------------------------------ */

		const where: Prisma.MediaWhereInput = {
			status: { in: status },
			type,
			collectionId,
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
			sortBy === "NEWEST"
				? { createdAt: "desc" }
				: sortBy === "OLDEST"
					? { createdAt: "asc" }
					: sortBy === "TITLE"
						? { title: "asc" }
						: { sortOrder: "asc" };

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
