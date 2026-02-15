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
 * - Small result set (max 20 items)
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

		// Build search conditions
		const where: Prisma.MediaWhereInput = {
			AND: [
				// Use full-text search for better performance with indexed columns
				{
					OR: [
						{ title: { contains: query, mode: "insensitive" } },
						{ description: { contains: query, mode: "insensitive" } },
					],
				},
			],
		};

		// Add filters
		if (type) {
			where.type = type;
		}

		if (status && status.length > 0) {
			where.status = { in: status };
		} else {
			// Default to PUBLISHED for public search
			where.status = "PUBLISHED";
		}

		// Execute search with count in parallel for performance
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
					// Include minimal genre data for display
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
						take: 3, // Limit genres for performance
					},
					// Include creators for complete schema
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
						take: 3, // Limit for performance
					},
					// Optional collection
					collection: {
						select: {
							id: true,
							title: true,
							type: true,
						},
					},
				},
				orderBy: [
					{ viewCount: "desc" }, // Popular first
					{ rating: "desc" }, // Then by rating
					{ createdAt: "desc" }, // Then newest
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
