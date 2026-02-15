import { z } from "zod";

/**
 * Person Schema - For actor/crew data from TMDB
 */
export const PersonSchema = z.object({
	id: z.string(),
	tmdbId: z.number(),
	adult: z.boolean(),
	gender: z.number().nullable(),
	knownForDepartment: z.string().nullable(),
	name: z.string(),
	originalName: z.string(),
	popularity: z.number(),
	profilePath: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Person = z.infer<typeof PersonSchema>;

/**
 * KnownFor Schema - For movies/shows a person is known for
 */
export const KnownForSchema = z.object({
	id: z.string(),
	personId: z.string(),
	tmdbId: z.number(),
	adult: z.boolean(),
	backdropPath: z.string().nullable(),
	title: z.string(),
	originalLanguage: z.string().nullable(),
	originalTitle: z.string().nullable(),
	overview: z.string().nullable(),
	posterPath: z.string().nullable(),
	mediaType: z.string(),
	genreIds: z.string(), // JSON array stored as string
	popularity: z.number(),
	releaseDate: z.date().nullable(),
	video: z.boolean(),
	voteAverage: z.number(),
	voteCount: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type KnownFor = z.infer<typeof KnownForSchema>;

/**
 * Person with KnownFor - For detailed person data with their known works
 */
export const PersonWithKnownForSchema = PersonSchema.extend({
	knownFor: z.array(KnownForSchema),
});

export type PersonWithKnownFor = z.infer<typeof PersonWithKnownForSchema>;

/**
 * Person List Item - Minimal data for lists
 */
export const PersonListItemSchema = z.object({
	id: z.string(),
	tmdbId: z.number(),
	name: z.string(),
	profilePath: z.string().nullable(),
	knownForDepartment: z.string().nullable(),
	popularity: z.number(),
});

export type PersonListItem = z.infer<typeof PersonListItemSchema>;
