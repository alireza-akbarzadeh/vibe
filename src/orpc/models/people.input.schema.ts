import { z } from "zod";

/**
 * Create People Input
 */
export const createPeopleInputSchema = z.object({
	tmdbId: z.number(),
	adult: z.boolean().default(false),
	gender: z.number().nullable().optional(),
	knownForDepartment: z.string().nullable().optional(),
	name: z.string(),
	originalName: z.string().nullable().optional(),
	popularity: z.number().default(0),
	profilePath: z.string().nullable().optional(),

	// Known For Media (Optional array or single object?)
	// Based on previous schema, it seemed to mix Person + Media fields.
	// Let's separate them.
	knownFor: z
		.array(
			z.object({
				tmdbId: z.number(),
				mediaType: z.string(),
				title: z.string().optional(),
				name: z.string().optional(), // for TV shows
				posterPath: z.string().nullable().optional(),
				backdropPath: z.string().nullable().optional(),
				overview: z.string().nullable().optional(),
				releaseDate: z.string().nullable().optional(),
				firstAirDate: z.string().nullable().optional(),
				voteAverage: z.number().optional(),
				voteCount: z.number().optional(),
				genreIds: z.array(z.number()).optional(),
				originalLanguage: z.string().optional(),
				originalTitle: z.string().optional(),
				originCountry: z.array(z.string()).optional(),
			}),
		)
		.optional()
		.default([]),
});

export type CreatePeopleInput = z.infer<typeof createPeopleInputSchema>;

/**
 * Update People Input
 */
export const updatePeopleInputSchema = z.object({
	id: z.string(),
	tmdbId: z.number().optional(),
	adult: z.boolean().optional(),
	gender: z.number().nullable().optional(),
	knownForDepartment: z.string().nullable().optional(),
	name: z.string().optional(),
	originalName: z.string().nullable().optional(),
	popularity: z.number().optional(),
	profilePath: z.string().nullable().optional(),
});

export type UpdatePeopleInput = z.infer<typeof updatePeopleInputSchema>;

/**
 * List People Input - For filtering and pagination
 */
export const listPeopleInputSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(20),
	search: z.string().optional(),
	person_id: z.number().optional(),
	movieId: z.number().optional(),
	media_type: z.string().optional(),
	sortBy: z
		.enum(["POPULARITY", "RATING", "RELEASE_DATE", "TITLE"])
		.default("POPULARITY"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListPeopleInput = z.infer<typeof listPeopleInputSchema>;

/**
 * Bulk Create People Input
 */
export const bulkCreatePeopleInputSchema = z.object({
	people: z.array(createPeopleInputSchema).min(1).max(1000), // Max 1000 at once
	skipDuplicates: z.boolean().default(true), // Skip if person_id + movieId already exists
});

export type BulkCreatePeopleInput = z.infer<typeof bulkCreatePeopleInputSchema>;
