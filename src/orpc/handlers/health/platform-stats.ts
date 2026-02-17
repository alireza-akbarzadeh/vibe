import { z } from "zod";
import { prisma } from "@/lib/db";
import { publicProcedure } from "@/orpc/context";

const PlatformStatsSchema = z.object({
	totalUsers: z.number(),
	totalMovies: z.number(),
	totalTracks: z.number(),
	totalMedia: z.number(),
});

/** Public endpoint that returns platform counts for the landing page */
export const getPlatformStats = publicProcedure
	.output(PlatformStatsSchema)
	.handler(async () => {
		const [totalUsers, totalMovies, totalTracks, totalMedia] =
			await Promise.all([
				prisma.user.count(),
				prisma.media.count({
					where: { type: "MOVIE", status: "PUBLISHED" },
				}),
				prisma.media.count({
					where: { type: "TRACK", status: "PUBLISHED" },
				}),
				prisma.media.count({ where: { status: "PUBLISHED" } }),
			]);

		return { totalUsers, totalMovies, totalTracks, totalMedia };
	});
