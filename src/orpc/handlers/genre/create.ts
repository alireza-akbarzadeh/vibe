import { z } from "zod";
import { db } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { createGenreInput, genreOutput } from "@/orpc/models/genre";
import { auditLog } from "../user/audit";

export const createGenre = adminProcedure
	.input(createGenreInput)
	.output(ResponseSchema.ApiResponseSchema(genreOutput))
	.handler(async ({ input, context, errors }) => {
		const existing = await db.client.genre.findUnique({
			where: { name: input.name },
		});

		if (existing) {
			throw errors.CONFLICT({
				message: "Genre already exists",
			});
		}

		const genre = await db.client.genre.create({
			data: input,
		});

		await auditLog({
			userId: context.user.id,
			action: "CREATE_GENRE",
			resource: "Genre",
			resourceId: genre.id,
			metadata: input,
		});

		return {
			status: 201,
			message: "Genre created successfully",
			data: {
				id: genre.id,
				name: genre.name,
				description: genre.description,
				type: genre.type,
			},
		};
	});

// Bulk input schema
const bulkCreateGenreInput = z.array(createGenreInput);

export const bulkCreateGenre = adminProcedure
	.input(bulkCreateGenreInput)
	.output(ResponseSchema.ApiResponseSchema(z.array(genreOutput)))
	.handler(async ({ input, context, errors }) => {
		if (!input.length) {
			throw errors.BAD_REQUEST({
				message: "No genres provided",
			});
		}

		// Normalize names to avoid case-based duplicates
		const normalizedInput = input.map((g) => ({
			...g,
			name: g.name.trim(),
		}));

		// Get existing genres (by name + type)
		const existingGenres = await db.client.genre.findMany({
			where: {
				OR: normalizedInput.map((g) => ({
					name: g.name,
					type: g.type,
				})),
			},
			select: {
				name: true,
				type: true,
			},
		});

		const existingSet = new Set(
			existingGenres.map((g) => `${g.name}-${g.type}`),
		);

		const newGenres = normalizedInput.filter(
			(g) => !existingSet.has(`${g.name}-${g.type}`),
		);

		if (!newGenres.length) {
			throw errors.CONFLICT({
				message: "All provided genres already exist",
			});
		}

		// Create in bulk
		await db.client.genre.createMany({
			data: newGenres,
			skipDuplicates: true,
		});

		// Fetch created genres to return full objects
		const createdGenres = await db.client.genre.findMany({
			where: {
				OR: newGenres.map((g) => ({
					name: g.name,
					type: g.type,
				})),
			},
			orderBy: { name: "asc" },
		});

		// Audit log (single aggregated log instead of per-row for performance)
		await auditLog({
			userId: context.user.id,
			action: "BULK_CREATE_GENRE",
			resource: "Genre",
			resourceId: undefined,
			metadata: {
				count: createdGenres.length,
				genres: createdGenres.map((g) => ({
					id: g.id,
					name: g.name,
					type: g.type,
				})),
			},
		});

		return {
			status: 201,
			message: `${createdGenres.length} genres created successfully`,
			data: createdGenres.map((g) => ({
				id: g.id,
				name: g.name,
				description: g.description,
				type: g.type,
			})),
		};
	});
