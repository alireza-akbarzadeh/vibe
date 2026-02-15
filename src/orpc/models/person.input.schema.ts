import { z } from "zod";

/**
 * TMDB Known For Movie/Show Input - matches TMDB API structure
 */
export const knownForInputSchema = z.object({
	adult: z.boolean().default(false),
	backdrop_path: z.string().nullable().optional(),
	id: z.number(), // TMDB movie/show ID
	title: z.string().optional(), // For movies
	name: z.string().optional(), // For TV shows
	original_language: z.string().optional(),
	original_title: z.string().optional(), // For movies
	original_name: z.string().optional(), // For TV shows
	overview: z.string().optional(),
	poster_path: z.string().nullable().optional(),
	media_type: z.enum(["movie", "tv"]),
	genre_ids: z.array(z.number()),
	popularity: z.number().default(0),
	release_date: z.string().optional(), // ISO date string
	first_air_date: z.string().optional(), // ISO date string for TV
	video: z.boolean().default(false),
	vote_average: z.number().default(0),
	vote_count: z.number().default(0),
});

export type KnownForInput = z.infer<typeof knownForInputSchema>;

/**
 * Create Person Input - matches TMDB person search response structure
 */
export const createPersonInputSchema = z.object({
	adult: z.boolean().default(false),
	gender: z.number().optional().default(0), // 0=not set, 1=female, 2=male, 3=non-binary
	id: z.number(), // TMDB person ID
	known_for_department: z.string().optional(),
	name: z.string(),
	original_name: z.string().optional(),
	popularity: z.number().default(0),
	profile_path: z.string().nullable().optional(),
	known_for: z.array(knownForInputSchema).optional().default([]),
});

export type CreatePersonInput = z.infer<typeof createPersonInputSchema>;

/**
 * Update Person Input
 */
export const updatePersonInputSchema = z.object({
	id: z.string(), // Internal ID
	adult: z.boolean().optional(),
	gender: z.number().optional(),
	knownForDepartment: z.string().nullable().optional(),
	name: z.string().optional(),
	originalName: z.string().optional(),
	popularity: z.number().optional(),
	profilePath: z.string().nullable().optional(),
});

export type UpdatePersonInput = z.infer<typeof updatePersonInputSchema>;

/**
 * List Person Input - for querying persons
 */
export const listPersonInputSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(20),
	search: z.string().optional(),
	knownForDepartment: z.string().optional(),
	sortBy: z
		.enum(["popularity", "name", "createdAt"])
		.default("popularity")
		.optional(),
	sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
});

export type ListPersonInput = z.infer<typeof listPersonInputSchema>;

/**
 * Bulk Create Person Input
 */
export const bulkCreatePersonInputSchema = z.object({
	persons: z.array(createPersonInputSchema).min(1).max(1000), // Max 1000 at once
	skipDuplicates: z.boolean().default(true),
});

export type BulkCreatePersonInput = z.infer<typeof bulkCreatePersonInputSchema>;

/**
 * Bulk Delete Input
 */
export const bulkDeleteInputSchema = z.object({
	ids: z.array(z.string()).min(1),
});

export type BulkDeleteInput = z.infer<typeof bulkDeleteInputSchema>;
