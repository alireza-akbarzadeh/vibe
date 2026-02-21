import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db.server";
import { publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { listPersonInputSchema } from "@/orpc/models/person.input.schema";
import {
	PersonListItemSchema,
	PersonWithKnownForSchema,
} from "@/orpc/models/person.schema";

/**
 * Get a single person by ID with their known_for movies
 */
export const find = publicProcedure
	.input(z.object({ id: z.string() }))
	.output(ApiResponseSchema(PersonWithKnownForSchema))
	.handler(async ({ input }) => {
		const person = await db.client.person.findUnique({
			where: { id: input.id },
			include: {
				knownFor: {
					orderBy: { popularity: "desc" },
				},
			},
		});

		if (!person) {
			throw new Error("Person not found");
		}

		return {
			status: 200,
			message: "Person retrieved successfully",
			data: person,
		};
	});

/**
 * List persons with pagination, search, and filtering
 */
export const list = publicProcedure
	.input(listPersonInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(PersonListItemSchema),
				total: z.number(),
				page: z.number(),
				limit: z.number(),
				totalPages: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { page, limit, search, knownForDepartment, sortBy, sortOrder } =
			input;

		// Build where clause
		const where: Prisma.PersonWhereInput = {
			...(search
				? {
						OR: [
							{ name: { contains: search, mode: "insensitive" } },
							{ originalName: { contains: search, mode: "insensitive" } },
						],
					}
				: {}),
			...(knownForDepartment ? { knownForDepartment } : {}),
		};

		// Build order by clause
		const orderBy: Prisma.PersonOrderByWithRelationInput =
			sortBy === "name"
				? { name: sortOrder }
				: sortBy === "createdAt"
					? { createdAt: sortOrder }
					: { popularity: sortOrder }; // default

		// Execute query with pagination
		const [items, total] = await Promise.all([
			db.client.person.findMany({
				where,
				select: {
					id: true,
					tmdbId: true,
					name: true,
					profilePath: true,
					knownForDepartment: true,
					popularity: true,
				},
				orderBy,
				skip: (page - 1) * limit,
				take: limit,
			}),
			db.client.person.count({ where }),
		]);

		return {
			status: 200,
			message: "Persons retrieved successfully",
			data: {
				items,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	});

/**
 * Find persons by TMDB person ID
 * Useful for checking if a person from TMDB already exists
 */
export const findByTmdbId = publicProcedure
	.input(z.object({ tmdbId: z.number() }))
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(PersonWithKnownForSchema),
				total: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { tmdbId } = input;

		const [items, total] = await Promise.all([
			db.client.person.findMany({
				where: { tmdbId },
				include: {
					knownFor: {
						orderBy: { popularity: "desc" },
					},
				},
			}),
			db.client.person.count({ where: { tmdbId } }),
		]);

		return {
			status: 200,
			message: "Persons retrieved successfully",
			data: {
				items,
				total,
			},
		};
	});
