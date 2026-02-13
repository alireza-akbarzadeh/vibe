// --- MediaItem schema with Prisma types ---
import { z } from "zod";

export const GenreSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
});

export const MediaGenreSchema = z.object({
	genre: GenreSchema,
});

export const CreatorSchema = z.object({
	id: z.string(),
	name: z.string(),
	bio: z.string().nullable().optional(),
	image: z.string().nullable().optional(),
	birthDate: z.date().nullable().optional(),
});

export const MediaCreatorSchema = z.object({
	creator: CreatorSchema,
	role: z.enum(["DIRECTOR", "ARTIST", "ACTOR", "PRODUCER"]),
});

export const CollectionMediaSchema = z.object({
	id: z.string(),
	title: z.string(),
	thumbnail: z.string().nullable().optional(),
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
});

export const CollectionSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable().optional(),
	thumbnail: z.string().nullable().optional(),
	type: z.enum(["SERIES", "ALBUM", "PLAYLIST"]),
	media: z.array(CollectionMediaSchema),
});

export const MediaItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	thumbnail: z.string(),
	videoUrl: z.string().nullable().optional(),
	audioUrl: z.string().nullable().optional(),
	duration: z.number(),
	releaseYear: z.number(),
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
	createdAt: z.date(),
	updatedAt: z.date(),
	collectionId: z.string().nullable().optional(),
	collection: CollectionSchema.nullable().optional(),
	sortOrder: z.number().nullable().optional(),
	genres: z.array(MediaGenreSchema),
	creators: z.array(MediaCreatorSchema),
});

/* -------------------------------------------------------------------------- */
/*                              Collection Schema                              */
/* -------------------------------------------------------------------------- */

export const CollectionListItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable().optional(),
	thumbnail: z.string().nullable().optional(),
	type: z.enum(["SERIES", "ALBUM", "PLAYLIST"]),
	media: z.array(CollectionMediaSchema),
});

export const getGenreOutput = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable(),
	}),
);
