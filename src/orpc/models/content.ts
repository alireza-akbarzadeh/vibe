import { z } from "zod";

/* --------------------------------- Inputs --------------------------------- */

export const latestReleasesInputSchema = z.object({
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]).optional(),
	limit: z.number().min(1).max(50).default(20),
	page: z.number().min(1).default(1),
});

export const popularSeriesInputSchema = z.object({
	limit: z.number().min(1).max(50).default(20),
	page: z.number().min(1).default(1),
});

export const genericContentInputSchema = z.object({
	limit: z.number().min(1).max(50).default(20),
	page: z.number().min(1).default(1),
});

/* --------------------------------- Types --------------------------------- */

export type LatestReleasesInput = z.infer<typeof latestReleasesInputSchema>;
export type PopularSeriesInput = z.infer<typeof popularSeriesInputSchema>;
