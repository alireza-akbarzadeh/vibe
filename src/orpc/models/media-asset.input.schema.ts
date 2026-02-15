import { z } from "zod";

/**
 * TMDB Video Input - matches TMDB API video structure
 */
export const createVideoInputSchema = z.object({
	iso_639_1: z.string().optional(),
	iso_3166_1: z.string().optional(),
	name: z.string(),
	key: z.string(),
	site: z.string().default("YouTube"),
	size: z.number().default(1080),
	type: z.string(), // Will be mapped to VideoType enum
	official: z.boolean().default(false),
	published_at: z.string(), // ISO date string
	id: z.string(), // TMDB video ID
});

export type CreateVideoInput = z.infer<typeof createVideoInputSchema>;

/**
 * Bulk Create Videos Input - attach multiple videos to a media
 */
export const bulkCreateVideosInputSchema = z.object({
	mediaId: z.string(),
	videos: z.array(createVideoInputSchema).min(1).max(100),
	skipDuplicates: z.boolean().default(true),
});

export type BulkCreateVideosInput = z.infer<typeof bulkCreateVideosInputSchema>;

/**
 * List Videos Input
 */
export const listVideosInputSchema = z.object({
	mediaId: z.string(),
	type: z.string().optional(), // Filter by video type
	official: z.boolean().optional(), // Filter official only
	sortBy: z.enum(["publishedAt", "name", "type"]).default("publishedAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListVideosInput = z.infer<typeof listVideosInputSchema>;

/**
 * TMDB Image Input - matches TMDB API image structure
 */
export const createImageInputSchema = z.object({
	file_path: z.string(),
	aspect_ratio: z.number(),
	height: z.number(),
	width: z.number(),
	iso_639_1: z.string().nullable().optional(),
	vote_average: z.number().default(0),
	vote_count: z.number().default(0),
	type: z.enum(["Backdrop", "Poster", "Still", "Logo"]), // Image type
});

export type CreateImageInput = z.infer<typeof createImageInputSchema>;

/**
 * Bulk Create Images Input - attach multiple images to a media
 */
export const bulkCreateImagesInputSchema = z.object({
	mediaId: z.string(),
	images: z.array(createImageInputSchema).min(1).max(200),
	skipDuplicates: z.boolean().default(true),
});

export type BulkCreateImagesInput = z.infer<typeof bulkCreateImagesInputSchema>;

/**
 * List Images Input
 */
export const listImagesInputSchema = z.object({
	mediaId: z.string(),
	type: z.enum(["Backdrop", "Poster", "Still", "Logo"]).optional(),
	sortBy: z.enum(["voteAverage", "aspectRatio"]).default("voteAverage"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListImagesInput = z.infer<typeof listImagesInputSchema>;

/**
 * Delete Video Input
 */
export const deleteVideoInputSchema = z.object({
	id: z.string(),
});

export type DeleteVideoInput = z.infer<typeof deleteVideoInputSchema>;

/**
 * Delete Image Input
 */
export const deleteImageInputSchema = z.object({
	id: z.string(),
});

export type DeleteImageInput = z.infer<typeof deleteImageInputSchema>;

/**
 * Delete All Media Assets Input - removes all videos and images for a media
 */
export const deleteAllMediaAssetsInputSchema = z.object({
	mediaId: z.string(),
});

export type DeleteAllMediaAssetsInput = z.infer<
	typeof deleteAllMediaAssetsInputSchema
>;
