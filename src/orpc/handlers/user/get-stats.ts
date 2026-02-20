import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";

const UserStatsSchema = z.object({
	totalUsers: z.number(),
	activeNow: z.number(),
	churnRate: z.number(),
	flaggedUsers: z.number(),
});

export const getUserStats = authedProcedure
	.output(UserStatsSchema)
	.handler(async () => {
		// Get total users
		const totalUsers = await prisma.user.count();

		// Get active users (logged in within last 24 hours)
		const oneDayAgo = new Date();
		oneDayAgo.setDate(oneDayAgo.getDate() - 1);

		// Note: This is a placeholder since we don't have lastLogin in schema yet
		// You would need to add lastLogin to user schema for accurate stats
		const activeNow = 0; // Placeholder

		// Get flagged users (banned users)
		const flaggedUsers = await prisma.user.count({
			where: { banned: true },
		});

		// Calculate churn rate (placeholder - would need subscription cancellation data)
		const churnRate = 0.8; // Placeholder

		return {
			totalUsers,
			activeNow,
			churnRate,
			flaggedUsers,
		};
	});
