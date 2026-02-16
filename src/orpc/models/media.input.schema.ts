import { z } from "zod";

export const getCollectionInputSchema = z.object({
	type: z.enum(["SERIES", "ALBUM", "PLAYLIST"]).optional(),
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(50).default(20),
});

export const createMediaInputSchema = z.object({
	title: z.string(),
	description: z.string(),
	thumbnail: z.string(),
	videoUrl: z.string().nullable().optional(),
	audioUrl: z.string().nullable().optional(),
	duration: z.number(),
	releaseYear: z.number(),
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
	status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "REJECTED"]).default("DRAFT"),
	collectionId: z.string().nullable().optional(),
	sortOrder: z.number().nullable().optional(),
	genreIds: z.array(z.string()).optional(),
	creatorIds: z.array(z.string()).optional(),
});

// Category filter enum
export const MediaCategorySchema = z.enum([
	"ALL",
	"MOVIES",
	"SERIES",
	"ANIMATION",
	"TRENDING",
	"RECENT",
	"MY_LIST",
	"TOP_RATED",
	"TV_SERIES",
	"HORROR",
	"COMEDY",
	"ROMANCE",
	"TOP_IMDB",
]);

export const listMediaInputSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(50).default(20),

	search: z.string().min(1).optional(),

	// Quick category filter (overrides other filters when set)
	category: MediaCategorySchema.optional(),

	type: z.enum(["MOVIE", "EPISODE", "TRACK"]).optional(),
	collectionId: z.string().optional(),
	genreIds: z.array(z.string()).optional(),
	creatorIds: z.array(z.string()).optional(),
	status: z
		.array(z.enum(["DRAFT", "REVIEW", "PUBLISHED", "REJECTED"]))
		.default(["PUBLISHED"]),

	releaseYearFrom: z.number().optional(),
	releaseYearTo: z.number().optional(),

	sortBy: z.enum(["NEWEST", "OLDEST", "TITLE", "MANUAL"]).default("NEWEST"),
});

export type ListMediaInput = z.infer<typeof listMediaInputSchema>;
