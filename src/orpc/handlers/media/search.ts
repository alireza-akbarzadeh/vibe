import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { MediaListItemSchema } from "@/orpc/models/media.schema";

/**
 * Fast Media Search API
 * Optimized for autocomplete/search dropdown with:
 * - Full-text search on title and description
 * - Indexed queries for performance
 * - Small result set (max 50 items)
 * - Minimal data transfer
 */
export const searchMedia = publicProcedure
	.input(
		z.object({
			query: z.string().min(1, "Search query is required"),
			limit: z.number().min(1).max(50).default(20),
			type: z.enum(["MOVIE", "EPISODE", "TRACK"]).optional(),
			status: z
				.array(z.enum(["DRAFT", "REVIEW", "PUBLISHED", "REJECTED"]))
				.optional(),
		}),
	)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(MediaListItemSchema),
				total: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { query, limit, type, status } = input;

		// Normalize query: trim, lowercase, collapse spaces, remove special chars
		const normalizedQuery = query
			.trim()
			.toLowerCase()
			.replace(/\s+/g, " ")
			.replace(/[^\w\s]/g, " ")
			.trim();

		// Return empty if query too short
		if (normalizedQuery.length < 2) {
			return {
				status: 200,
				message: "Query too short",
				data: {
					items: [],
					total: 0,
				},
			};
		}

		// Split into words
		const searchWords = normalizedQuery
			.split(" ")
			.filter((word) => word.length > 0);

		const where: Prisma.MediaWhereInput = {
			AND: searchWords.map((word) => ({
				OR: [
					{
						title: {
							contains: word,
							mode: "insensitive" as Prisma.QueryMode,
						},
					},
					{
						description: {
							contains: word,
							mode: "insensitive" as Prisma.QueryMode,
						},
					},
				],
			})),
		};

		if (type) {
			where.type = type;
		}

		if (status && status.length > 0) {
			where.status = { in: status };
		} else {
			where.status = "PUBLISHED";
		}

		const [items, total] = await Promise.all([
			prisma.media.findMany({
				where,
				select: {
					id: true,
					title: true,
					description: true,
					thumbnail: true,
					type: true,
					releaseYear: true,
					rating: true,
					viewCount: true,
					duration: true,
					createdAt: true,
					updatedAt: true,
					status: true,
					genres: {
						select: {
							genre: {
								select: {
									id: true,
									name: true,
									description: true,
								},
							},
						},
						take: 3,
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
						take: 3,
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
			}),
			prisma.media.count({ where }),
		]);

		return {
			status: 200,
			message: "Search results retrieved successfully",
			data: {
				items,
				total,
			},
		};
	});
