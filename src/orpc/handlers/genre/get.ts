import { z } from "zod";
import { db } from "@/lib/db.server";
import { publicProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { genreListOutput, genreOutput } from "@/orpc/models/genre";

/**
 * Get all genres (public - anyone can view)
 */
export const listGenres = publicProcedure
	.input(
		z
			.object({
				search: z.string().optional(),
				type: z.enum(["MOVIE", "EPISODE", "TRACK"]).optional(),
			})
			.optional(),
	)
	.output(ResponseSchema.ApiResponseSchema(genreListOutput))
	.handler(async ({ input = {} }) => {
		const { search, type } = input;

		const genres = await db.client.genre.findMany({
			where: {
				...(type ? { type } : {}),
				...(search
					? {
							name: {
								contains: search,
								mode: "insensitive",
							},
						}
					: {}),
			},
			orderBy: { name: "asc" },
			select: {
				id: true,
				name: true,
				description: true,
				type: true,
			},
		});

		return {
			status: 200,
			message: "Genres retrieved successfully",
			data: genres,
		};
	});

/**
 * Get a single genre by ID (public)
 */
export const getGenre = publicProcedure
	.input(z.object({ id: z.string() }))
	.output(ResponseSchema.ApiResponseSchema(genreOutput))
	.handler(async ({ input, errors }) => {
		const genre = await db.client.genre.findUnique({
			where: { id: input.id },
		});

		if (!genre) {
			throw errors.NOT_FOUND({ message: "Genre not found" });
		}

		return {
			status: 200,
			message: "Genre retrieved successfully",
			data: {
				id: genre.id,
				name: genre.name,
				description: genre.description,
				type: genre.type,
			},
		};
	});
