import { z } from "zod";

/**
 * Create People Input
 */
export const createPeopleInputSchema = z.object({
	person_id: z.number(),
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable().optional(),
	movieId: z.number(),
	title: z.string(),
	original_language: z.string().nullable().optional(),
	original_title: z.string().nullable().optional(),
	overview: z.string().nullable().optional(),
	poster_path: z.string().nullable().optional(),
	media_type: z.string().default("movie"),
	genre_ids: z.array(z.number()).default([]),
	popularity: z.number().default(0),
	release_date: z.coerce.date().nullable().optional(),
	video: z.boolean().default(false),
	vote_average: z.number().default(0),
	vote_count: z.number().default(0),
});

export type CreatePeopleInput = z.infer<typeof createPeopleInputSchema>;

/**
 * Update People Input
 */
export const updatePeopleInputSchema = z.object({
	id: z.string(),
	person_id: z.number().optional(),
	adult: z.boolean().optional(),
	backdrop_path: z.string().nullable().optional(),
	movieId: z.number().optional(),
	title: z.string().optional(),
	original_language: z.string().nullable().optional(),
	original_title: z.string().nullable().optional(),
	overview: z.string().nullable().optional(),
	poster_path: z.string().nullable().optional(),
	media_type: z.string().optional(),
	genre_ids: z.array(z.number()).optional(),
	popularity: z.number().optional(),
	release_date: z.coerce.date().nullable().optional(),
	video: z.boolean().optional(),
	vote_average: z.number().optional(),
	vote_count: z.number().optional(),
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
