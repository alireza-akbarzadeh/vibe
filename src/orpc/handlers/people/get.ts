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
		const person = await prisma.people.findUnique({
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
		const {
			page,
			limit,
			search,
			person_id,
			movieId,
			media_type,
			sortBy,
			sortOrder,
		} = input;

		const skip = (page - 1) * limit;

		// Build where clause
		const where: Prisma.PeopleWhereInput = {
			...(person_id && { person_id }),
			...(movieId && { movieId }),
			...(media_type && { media_type }),
			...(search && {
				OR: [
					{ title: { contains: search, mode: "insensitive" } },
					{ original_title: { contains: search, mode: "insensitive" } },
					{ overview: { contains: search, mode: "insensitive" } },
				],
			}),
		};

		// Build orderBy clause
		const orderBy: Prisma.PeopleOrderByWithRelationInput =
			sortBy === "POPULARITY"
				? { popularity: sortOrder }
				: sortBy === "RATING"
					? { vote_average: sortOrder }
					: sortBy === "RELEASE_DATE"
						? { release_date: sortOrder }
						: { title: sortOrder };

		// Execute queries in parallel
		const [items, total] = await Promise.all([
			prisma.people.findMany({
				where,
				orderBy,
				skip,
				take: limit,
				select: {
					id: true,
					person_id: true,
					movieId: true,
					title: true,
					poster_path: true,
					popularity: true,
					vote_average: true,
					release_date: true,
				},
			}),
			prisma.people.count({ where }),
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
		const { person_id, page, limit } = input;
		const skip = (page - 1) * limit;

		const [items, total] = await Promise.all([
			prisma.people.findMany({
				where: { person_id },
				orderBy: { popularity: "desc" },
				skip,
				take: limit,
				select: {
					id: true,
					person_id: true,
					movieId: true,
					title: true,
					poster_path: true,
					popularity: true,
					vote_average: true,
					release_date: true,
				},
			}),
			prisma.people.count({ where: { person_id } }),
		]);

		return {
			status: 200,
			message: "People retrieved successfully",
			data: {
				items,
				total,
			},
		};
	});
