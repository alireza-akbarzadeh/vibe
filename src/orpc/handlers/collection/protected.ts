// src/orpc/procedures/collection.ts
import { z } from "zod";
import type { CollectionWhereInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/db.server";
import { publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";

/* -------------------------------------------------------------------------- */
/*                                LIST COLLECTIONS                             */
/* -------------------------------------------------------------------------- */
export const listCollections = publicProcedure
	.input(
		z.object({
			page: z.number().min(1).default(1),
			limit: z.number().min(1).max(100).default(20),
			search: z.string().optional(),
			type: z.enum(["SERIES", "ALBUM", "PLAYLIST"]).optional(),
		}),
	)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(
					z.object({
						id: z.string(),
						title: z.string(),
						description: z.string().nullable(),
						thumbnail: z.string().nullable(),
						type: z.enum(["SERIES", "ALBUM", "PLAYLIST"]),
						createdAt: z.string(),
						updatedAt: z.string(),
					}),
				),
				total: z.number(),
				page: z.number(),
				limit: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { page, limit, search, type } = input;
		const where: CollectionWhereInput = { ...(type ? { type } : {}) };

		if (search) {
			where.title = { contains: search, mode: "insensitive" };
		}

		const total = await prisma.collection.count({ where });
		const items = await prisma.collection.findMany({
			where,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { createdAt: "desc" },
		});

		return {
			status: 200,
			message: "Collections fetched successfully",
			data: {
				items: items.map((item) => ({
					...item,
					createdAt: item.createdAt.toISOString(),
					updatedAt: item.updatedAt.toISOString(),
				})),
				total,
				page,
				limit,
			},
		};
	});
