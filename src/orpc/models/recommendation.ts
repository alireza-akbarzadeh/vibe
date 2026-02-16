import { z } from "zod";
import { MediaListItemSchema } from "./media.schema";

/* --------------------------------- Inputs --------------------------------- */

export const genreBasedInputSchema = z.object({
	profileId: z.string(),
	limit: z.number().min(1).max(50).default(20),
	excludeWatched: z.boolean().default(true),
});

export const continueWatchingInputSchema = z.object({
	profileId: z.string(),
	limit: z.number().min(1).max(20).default(10),
});

export const trendingInputSchema = z.object({
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]).optional(),
	limit: z.number().min(1).max(50).default(20),
	days: z.number().min(1).max(90).default(7), // Views in last X days
	page: z.number().min(1).default(1),
});

/* --------------------------------- Outputs --------------------------------- */

export const recommendationOutputSchema = z.object({
	items: z.array(MediaListItemSchema),
	reason: z.string().optional(), // e.g., "Based on Action and Sci-Fi genres"
});

/* --------------------------------- Types --------------------------------- */

export type GenreBasedInput = z.infer<typeof genreBasedInputSchema>;
export type ContinueWatchingInput = z.infer<typeof continueWatchingInputSchema>;
export type TrendingInput = z.infer<typeof trendingInputSchema>;
export type RecommendationOutput = z.infer<typeof recommendationOutputSchema>;
