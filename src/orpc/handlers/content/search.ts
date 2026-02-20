import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { publicProcedure } from "@/orpc/context";

const searchInputSchema = z.object({
	query: z.string().min(1).max(200),
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]).optional(),
	limit: z.number().min(1).max(50).default(20),
	page: z.number().min(1).default(1),
});

export const searchContent = publicProcedure
	.route({ method: "GET" })
	.input(searchInputSchema)
	.handler(async ({ input }) => {
		const { query, type, limit, page } = input;
		const skip = (page - 1) * limit;

		const where = {
			status: "PUBLISHED" as const,
			...(type && { type }),
			OR: [
				{ title: { contains: query, mode: "insensitive" as const } },
				{
					description: {
						contains: query,
						mode: "insensitive" as const,
					},
				},
			],
		};

		const [items, total] = await Promise.all([
			prisma.media.findMany({
				where,
				include: {
					genres: { include: { genre: true } },
					collection: {
						select: { id: true, title: true, type: true },
					},
				},
				orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
				skip,
				take: limit,
			}),
			prisma.media.count({ where }),
		]);

		return {
			status: 200,
			message: "Search results",
			data: {
				items,
				total,
				page,
				totalPages: Math.ceil(total / limit),
			},
		};
	});
