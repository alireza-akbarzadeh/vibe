import { z } from "zod";
import { db } from "@/lib/db.server";
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
		const totalUsers = await db.client.user.count();

		const oneDayAgo = new Date();
		oneDayAgo.setDate(oneDayAgo.getDate() - 1);

		const activeNow = 0;

		const flaggedUsers = await db.client.user.count({
			where: { banned: true },
		});

		const churnRate = 0.8;

		return {
			totalUsers,
			activeNow,
			churnRate,
			flaggedUsers,
		};
	});
