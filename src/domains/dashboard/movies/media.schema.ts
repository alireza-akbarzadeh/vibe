import { z } from "zod";

export const mediaFormSchema = z.object({
	// Core Media Info
	title: z.string().min(1, "Title is required").max(200, "Title is too long"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	thumbnail: z.string().url("Invalid thumbnail URL"),
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
	status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "REJECTED"]).default("DRAFT"),

	// Media Files
	videoUrl: z.string().url("Invalid video URL").nullable().optional(),
	audioUrl: z.string().url("Invalid audio URL").nullable().optional(),

	// Metadata
	duration: z.number().min(1, "Duration must be at least 1 second"),
	releaseYear: z
		.number()
		.min(1900, "Invalid release year")
		.max(new Date().getFullYear() + 5, "Release year is too far in the future"),

	// Ratings & Stats (optional for create, auto-generated)
	rating: z.number().min(0).max(10).nullable().optional(),
	criticalScore: z.number().min(0).max(100).nullable().optional(),
	reviewCount: z.number().min(0).default(0),
	viewCount: z.number().min(0).default(0),

	// Relationships
	collectionId: z.string().nullable().optional(),
	sortOrder: z.number().nullable().optional(),
	genreIds: z.array(z.string()).default([]),
	creatorIds: z.array(z.string()).default([]),

	// Timestamps (for edit mode)
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	id: z.string().optional(),
});

export type MediaFormData = z.infer<typeof mediaFormSchema>;

// Bulk create schema (array of media forms)
export const bulkMediaFormSchema = z.array(mediaFormSchema);

export type BulkMediaFormData = z.infer<typeof bulkMediaFormSchema>;
