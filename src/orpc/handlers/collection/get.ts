import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db.server";
import { publicProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { collectionOutput } from "@/orpc/models/collection";

export const listCollections = publicProcedure
	.input(
		ResponseSchema.PaginationInputSchema.extend({
			type: z.enum(["SERIES", "ALBUM", "PLAYLIST"]).optional(),
		}),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			ResponseSchema.PaginatedOutput(collectionOutput),
		),
	)
	.handler(async ({ input }) => {
		const { page, limit, search, type } = input;
		const where: Prisma.CollectionWhereInput = { ...(type ? { type } : {}) };

		if (search) {
			where.title = { contains: search, mode: "insensitive" };
		}

		const total = await db.client.collection.count({ where });
		const items = await db.client.collection.findMany({
			where,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { createdAt: "desc" },
		});

		return {
			status: 200,
			message: "Collections retrieved successfully",
			data: {
				items: items.map((item) => ({
					...item,
					createdAt: item.createdAt.toISOString(),
					updatedAt: item.updatedAt.toISOString(),
				})),
				pagination: {
					page,
					limit,
					total,
				},
			},
		};
	});
