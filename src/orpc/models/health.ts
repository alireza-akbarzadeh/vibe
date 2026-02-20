import { z } from "zod";

export const PlatformStatsSchema = z.object({
	totalUsers: z.number(),
	totalMovies: z.number(),
	totalTracks: z.number(),
	totalMedia: z.number(),
});
