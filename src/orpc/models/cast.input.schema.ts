import { z } from "zod";

/**
 * Input schema for creating cast members
 */
export const createCastMemberInputSchema = z.object({
	mediaId: z.string(),
	personId: z.string(),
	castType: z.enum([
		"ACTOR",
		"DIRECTOR",
		"WRITER",
		"PRODUCER",
		"CINEMATOGRAPHER",
		"COMPOSER",
		"EDITOR",
		"OTHER",
	]),
	role: z.string().optional(), // Character name for actors, job title for crew
	order: z.number().default(0),
	tmdbCreditId: z.string().optional(),
});

/**
 * Bulk create cast members (for TMDB import)
 */
export const bulkCreateCastInputSchema = z.object({
	mediaId: z.string(),
	cast: z.array(createCastMemberInputSchema),
	skipDuplicates: z.boolean().default(true),
});

/**
 * List cast members input
 */
export const listCastInputSchema = z.object({
	mediaId: z.string().optional(),
	personId: z.string().optional(),
	castType: z
		.enum([
			"ACTOR",
			"DIRECTOR",
			"WRITER",
			"PRODUCER",
			"CINEMATOGRAPHER",
			"COMPOSER",
			"EDITOR",
			"OTHER",
		])
		.optional(),
	limit: z.number().min(1).max(100).default(20),
	page: z.number().min(1).default(1),
});

/**
 * Update cast member input
 */
export const updateCastMemberInputSchema = z.object({
	id: z.string(),
	role: z.string().optional(),
	order: z.number().optional(),
	castType: z
		.enum([
			"ACTOR",
			"DIRECTOR",
			"WRITER",
			"PRODUCER",
			"CINEMATOGRAPHER",
			"COMPOSER",
			"EDITOR",
			"OTHER",
		])
		.optional(),
});

/**
 * Get cast for a specific media (grouped by type)
 */
export const getMediaCastInputSchema = z.object({
	mediaId: z.string(),
	includeActors: z.boolean().default(true),
	includeDirectors: z.boolean().default(true),
	includeWriters: z.boolean().default(true),
	includeProducers: z.boolean().default(true),
	includeCrew: z.boolean().default(true),
	maxActors: z.number().default(20), // Limit actors to prevent huge responses
	maxPerType: z.number().default(10), // Limit per crew type
});

/**
 * Delete cast member input
 */
export const deleteCastMemberInputSchema = z.object({
	id: z.string(),
});

/**
 * Delete all cast for a media
 */
export const deleteAllCastInputSchema = z.object({
	mediaId: z.string(),
});

export type CreateCastMemberInput = z.infer<typeof createCastMemberInputSchema>;
export type BulkCreateCastInput = z.infer<typeof bulkCreateCastInputSchema>;
export type ListCastInput = z.infer<typeof listCastInputSchema>;
export type GetMediaCastInput = z.infer<typeof getMediaCastInputSchema>;
export type DeleteCastMemberInput = z.infer<typeof deleteCastMemberInputSchema>;
export type DeleteAllCastInput = z.infer<typeof deleteAllCastInputSchema>;
export type UpdateCastMemberInput = z.infer<typeof updateCastMemberInputSchema>;
