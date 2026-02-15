import { z } from "zod";

/**
 * Video Type Enum - matches TMDB video types
 */
export const VideoTypeEnum = z.enum([
	"Trailer",
	"Teaser",
	"Clip",
	"Featurette",
	"BehindTheScenes",
	"Bloopers",
	"Recap",
	"Opening",
]);

export type VideoType = z.infer<typeof VideoTypeEnum>;

/**
 * Video Schema - For video metadata from TMDB
 */
export const VideoSchema = z.object({
	id: z.string(),
	mediaId: z.string(),
	tmdbId: z.string(),
	iso6391: z.string().nullable(),
	iso31661: z.string().nullable(),
	name: z.string(),
	key: z.string(),
	site: z.string(),
	size: z.number(),
	type: VideoTypeEnum,
	official: z.boolean(),
	publishedAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Video = z.infer<typeof VideoSchema>;

/**
 * Video List Item - Minimal data for lists
 */
export const VideoListItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string(),
	site: z.string(),
	type: VideoTypeEnum,
	official: z.boolean(),
	publishedAt: z.date(),
});

export type VideoListItem = z.infer<typeof VideoListItemSchema>;

/**
 * Image Type Enum - matches TMDB image types
 */
export const ImageTypeEnum = z.enum(["Backdrop", "Poster", "Still", "Logo"]);

export type ImageType = z.infer<typeof ImageTypeEnum>;

/**
 * Image Schema - For image metadata from TMDB
 */
export const ImageSchema = z.object({
	id: z.string(),
	mediaId: z.string(),
	filePath: z.string(),
	aspectRatio: z.number(),
	height: z.number(),
	width: z.number(),
	iso6391: z.string().nullable(),
	voteAverage: z.number(),
	voteCount: z.number(),
	type: ImageTypeEnum,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Image = z.infer<typeof ImageSchema>;

/**
 * Image List Item - Minimal data for lists
 */
export const ImageListItemSchema = z.object({
	id: z.string(),
	filePath: z.string(),
	aspectRatio: z.number(),
	type: ImageTypeEnum,
	voteAverage: z.number(),
});

export type ImageListItem = z.infer<typeof ImageListItemSchema>;
