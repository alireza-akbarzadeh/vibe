import { z } from "zod";

/**
 * Zod schema for Cast/Crew output
 */
export const CastMemberSchema = z.object({
	id: z.string(),
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
	role: z.string().nullable(),
	order: z.number(),
	tmdbCreditId: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	person: z.object({
		id: z.string(),
		tmdbId: z.number(),
		name: z.string(),
		originalName: z.string(),
		profilePath: z.string().nullable(),
		knownForDepartment: z.string().nullable(),
		popularity: z.number(),
	}),
});

/**
 * Grouped cast and crew by type
 */
export const GroupedCastSchema = z.object({
	actors: z.array(CastMemberSchema),
	directors: z.array(CastMemberSchema),
	writers: z.array(CastMemberSchema),
	producers: z.array(CastMemberSchema),
	crew: z.array(CastMemberSchema), // All other crew
});

export type CastMember = z.infer<typeof CastMemberSchema>;
export type GroupedCast = z.infer<typeof GroupedCastSchema>;
