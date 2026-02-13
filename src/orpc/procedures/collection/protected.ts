// src/orpc/procedures/collection.ts
import { os } from "@orpc/server";
import { z } from "zod";
import type { CollectionWhereInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/db";
import { withRequire } from "@/orpc/middleware";
import { ApiResponseSchema } from "@/orpc/schema";

/* -------------------------------------------------------------------------- */
/*                                  CREATE COLLECTION                          */
/* -------------------------------------------------------------------------- */
const createCollectionInput = z.object({
	title: z.string(),
	description: z.string().optional(),
	thumbnail: z.string().url().optional(),
	type: z.enum(["SERIES", "ALBUM", "PLAYLIST"]),
});

export const createCollection = os
	.use(
		withRequire({
			role: "ADMIN",
			permission: { resource: "collection", action: "create" },
		}),
	)
	.input(createCollectionInput)
	.output(
		ApiResponseSchema(
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
	)
	.handler(async ({ input }) => {
		const collection = await prisma.collection.create({
			data: input,
		});

		return {
			status: 200,
			message: "Collection created successfully",
			data: {
				...collection,
				createdAt: collection.createdAt.toISOString(),
				updatedAt: collection.updatedAt.toISOString(),
			},
		};
	});

/* -------------------------------------------------------------------------- */
/*                                  UPDATE COLLECTION                          */
/* -------------------------------------------------------------------------- */
const updateCollectionInput = createCollectionInput.extend({
	id: z.string(),
});

export const updateCollection = os
	.use(
		withRequire({
			role: "ADMIN",
			permission: { resource: "collection", action: "update" },
		}),
	)
	.input(updateCollectionInput)
	.output(
		ApiResponseSchema(
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
	)
	.handler(async ({ input }) => {
		const { id, ...data } = input;
		const collection = await prisma.collection.update({
			where: { id },
			data,
		});

		return {
			status: 200,
			message: "Collection updated successfully",
			data: {
				...collection,
				createdAt: collection.createdAt.toISOString(),
				updatedAt: collection.updatedAt.toISOString(),
			},
		};
	});

/* -------------------------------------------------------------------------- */
/*                                  DELETE COLLECTION                          */
/* -------------------------------------------------------------------------- */
export const deleteCollection = os
	.use(
		withRequire({
			role: "ADMIN",
			permission: { resource: "collection", action: "delete" },
		}),
	)
	.input(z.object({ id: z.string() }))
	.output(ApiResponseSchema(z.object({ id: z.string() })))
	.handler(async ({ input }) => {
		const collection = await prisma.collection.delete({
			where: { id: input.id },
		});

		return {
			status: 200,
			message: "Collection deleted successfully",
			data: { id: collection.id },
		};
	});

/* -------------------------------------------------------------------------- */
/*                                LIST COLLECTIONS                             */
/* -------------------------------------------------------------------------- */
export const listCollections = os
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
