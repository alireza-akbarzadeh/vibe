import { z } from "zod";

/**
 * KnownFor Item Schema
 */
export const KnownForSchema = z.object({
	id: z.string(),
	personId: z.string(),
	tmdbId: z.number(),
	mediaType: z.string(),
	mediaDetails: z.any(), // JSON
	createdAt: z.date(),
	updatedAt: z.date(),
});

/**
 * People Schema
 */
export const PeopleSchema = z.object({
	id: z.string(),
	tmdbId: z.number(),
	name: z.string(),
	originalName: z.string(),
	knownForDepartment: z.string().nullable(),
	adult: z.boolean(),
	gender: z.number().nullable(),
	popularity: z.number(),
	profilePath: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),

	// Relation
	knownFor: z.array(KnownForSchema).optional(),
});

export type People = z.infer<typeof PeopleSchema>;
export type KnownFor = z.infer<typeof KnownForSchema>;

export const PeopleListItemSchema = z.object({
	id: z.string(),
	tmdbId: z.number(),
	name: z.string(),
	profilePath: z.string().nullable(),
	knownForDepartment: z.string().nullable(),
	popularity: z.number(),
});

export type PersonListItem = z.infer<typeof PeopleListItemSchema>;
