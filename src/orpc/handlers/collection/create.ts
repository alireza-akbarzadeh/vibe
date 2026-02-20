// src/orpc/procedures/collection.ts

import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { collectionCreateProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	collectionOutput,
	createCollectionInput,
} from "@/orpc/models/collection";
import { auditLog } from "../user/audit";

export const createCollection = collectionCreateProcedure
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
	.handler(async ({ input, context }) => {
		const collection = await prisma.collection.create({
			data: input,
		});

		await auditLog({
			userId: context.user.id,
			action: "CREATE_COLLECTION",
			resource: "Collection",
			resourceId: collection.id,
			metadata: input,
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

// Bulk create collections
const bulkCreateCollectionInput = z.array(createCollectionInput);

export const bulkCreateCollection = collectionCreateProcedure
	.input(bulkCreateCollectionInput)
	.output(ApiResponseSchema(z.array(collectionOutput)))
	.handler(async ({ input, context, errors }) => {
		if (!input.length) {
			throw errors.BAD_REQUEST({
				message: "No collections provided",
			});
		}

		// Normalize titles to avoid case-based duplicates
		const normalizedInput = input.map((c) => ({
			...c,
			title: c.title.trim(),
		}));

		// Get existing collections by title
		const existingCollections = await prisma.collection.findMany({
			where: {
				title: {
					in: normalizedInput.map((c) => c.title),
				},
			},
			select: {
				title: true,
			},
		});

		const existingSet = new Set(existingCollections.map((c) => c.title));

		const newCollections = normalizedInput.filter(
			(c) => !existingSet.has(c.title),
		);

		if (!newCollections.length) {
			throw errors.CONFLICT({
				message: "All provided collections already exist",
			});
		}

		// Create in bulk
		await prisma.collection.createMany({
			data: newCollections,
			skipDuplicates: true,
		});

		// Fetch created collections to return full objects
		const createdCollections = await prisma.collection.findMany({
			where: {
				title: {
					in: newCollections.map((c) => c.title),
				},
			},
			orderBy: { title: "asc" },
		});

		// Audit log (single aggregated log for performance)
		await auditLog({
			userId: context.user.id,
			action: "BULK_CREATE_COLLECTION",
			resource: "Collection",
			resourceId: undefined,
			metadata: {
				count: createdCollections.length,
				collections: createdCollections.map((c) => ({
					id: c.id,
					title: c.title,
					type: c.type,
				})),
			},
		});

		return {
			status: 201,
			message: `${createdCollections.length} collections created successfully`,
			data: createdCollections.map((c) => ({
				id: c.id,
				title: c.title,
				description: c.description,
				thumbnail: c.thumbnail,
				type: c.type,
				createdAt: c.createdAt.toISOString(),
				updatedAt: c.updatedAt.toISOString(),
			})),
		};
	});
