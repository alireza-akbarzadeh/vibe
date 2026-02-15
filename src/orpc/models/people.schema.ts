import { z } from "zod";
import { PersonListItemSchema } from "./person.schema";

/**
 * People Schema - For cast/crew data
 */
export const PeopleSchema = z.object({
	id: z.string(),
	person_id: z.number(),
	adult: z.boolean(),
	backdrop_path: z.string().nullable(),
	movieId: z.number(),
	title: z.string(),
	original_language: z.string().nullable(),
	original_title: z.string().nullable(),
	overview: z.string().nullable(),
	poster_path: z.string().nullable(),
	media_type: z.string().nullable(),
	genre_ids: z.array(z.number()),
	popularity: z.number(),
	release_date: z.date().nullable(),
	video: z.boolean(),
	vote_average: z.number(),
	vote_count: z.number(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type People = z.infer<typeof PeopleSchema>;

/**
 * People List Item - Minimal data for list views
 */
export const PeopleListItemSchema = z.object({
	id: z.string(),
	person_id: z.number(),
	movieId: z.number(),
	title: z.string(),
	poster_path: z.string().nullable(),
	popularity: z.number(),
	vote_average: z.number(),
	release_date: z.date().nullable(),
});

export type PersonListItem = z.infer<typeof PersonListItemSchema>;
