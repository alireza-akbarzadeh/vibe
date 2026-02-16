import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { listPeopleInputSchema } from "@/orpc/models/people.input.schema";
import {
	PeopleListItemSchema,
	PeopleSchema,
} from "@/orpc/models/people.schema";

/**
 * Get Single Person by ID
 */
export const getPeople = publicProcedure
	.input(z.object({ id: z.string() }))
	.output(ApiResponseSchema(PeopleSchema))
	.handler(async ({ input }) => {
		const person = await prisma.person.findUnique({
			where: { id: input.id },
		});

		if (!person) {
			throw {
				code: "NOT_FOUND",
				status: 404,
				message: "Person not found",
			};
		}

		return {
			status: 200,
			message: "Person retrieved successfully",
			data: person,
		};
	});

/**
 * List People with Filters and Pagination
 */
export const listPeople = publicProcedure
	.input(listPeopleInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(PeopleListItemSchema),
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
		const { page, limit, search, sortBy, sortOrder } = input;

		const skip = (page - 1) * limit;

		// Build where clause
		const where: Prisma.PersonWhereInput = {
			...(search && {
				OR: [
					{ name: { contains: search, mode: "insensitive" } },
					{ originalName: { contains: search, mode: "insensitive" } },
				],
			}),
		};

		// Build orderBy clause
		const orderBy: Prisma.PersonOrderByWithRelationInput =
			sortBy === "RATING"
				? { popularity: sortOrder }
				: sortBy === "TITLE"
					? { name: sortOrder }
					: { createdAt: sortOrder };

		// Execute queries in parallel
		const [items, total] = await Promise.all([
			prisma.person.findMany({
				where,
				orderBy,
				skip,
				take: limit,
				select: {
					id: true,
					tmdbId: true,
					name: true,
					profilePath: true,
					knownForDepartment: true,
					popularity: true,
				},
			}),
			prisma.person.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			status: 200,
			message: "People list retrieved successfully",
			data: {
				items,
				pagination: {
					page,
					limit,
					total,
					totalPages,
				},
			},
		};
	});

/**
 * Get People by Person ID - All movies for a specific person
 */
export const getPeopleByPersonId = publicProcedure
	.input(
		z.object({
			person_id: z.number(),
			page: z.number().min(1).default(1),
			limit: z.number().min(1).max(100).default(20),
		}),
	)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(PeopleListItemSchema),
				total: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		// Not implemented correctly yet (removed)
		return {
			status: 200,
			message: "Not implemented",
			data: { items: [], total: 0 },
		};
	});
