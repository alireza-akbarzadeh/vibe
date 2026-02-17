import { z } from "zod";
import { polarClient } from "@/integrations/polar/polar-client";
import { prisma } from "@/lib/db";
import { adminProcedure } from "@/orpc/context";

/**
 * Admin: Get revenue/subscription analytics
 */
export const getSubscriptionStats = adminProcedure
	.output(
		z.object({
			totalSubscriptions: z.number(),
			activeSubscriptions: z.number(),
			cancelledSubscriptions: z.number(),
			trialingSubscriptions: z.number(),
			pastDueSubscriptions: z.number(),
			totalMrr: z.number(),
			totalArr: z.number(),
			currency: z.string(),
			totalCustomers: z.number(),
			localUserCount: z.number(),
			paidUserCount: z.number(),
		}),
	)
	.handler(async () => {
		// Fetch all subscriptions from Polar
		const allSubs = await polarClient.subscriptions.list({ limit: 100 });
		const items = allSubs.result.items;

		let totalMrr = 0;
		let active = 0;
		let cancelled = 0;
		let trialing = 0;
		let pastDue = 0;

		for (const sub of items) {
			const price = sub.prices?.[0];
			const amount =
				price && "priceAmount" in price ? price.priceAmount : 0;
			const interval =
				price && "recurringInterval" in price
					? price.recurringInterval
					: "month";

			if (sub.status === "active") {
				active++;
				// Normalize to monthly for MRR
				if (interval === "year") {
					totalMrr += amount / 12;
				} else if (interval === "month") {
					totalMrr += amount;
				}
			} else if (sub.status === "canceled") {
				cancelled++;
			} else if (sub.status === "trialing") {
				trialing++;
				// Count trialing in MRR since they'll convert
				if (interval === "year") {
					totalMrr += amount / 12;
				} else if (interval === "month") {
					totalMrr += amount;
				}
			} else if (sub.status === "past_due") {
				pastDue++;
			}
		}

		// Get customers count
		const customers = await polarClient.customers.list({ limit: 1 });
		const totalCustomers =
			customers.result.pagination.totalCount || 0;

		// Get local DB stats
		const [localUserCount, paidUserCount] = await Promise.all([
			prisma.user.count(),
			prisma.user.count({
				where: {
					subscriptionStatus: { in: ["PREMIUM", "FAMILY"] },
				},
			}),
		]);

		return {
			totalSubscriptions: items.length,
			activeSubscriptions: active,
			cancelledSubscriptions: cancelled,
			trialingSubscriptions: trialing,
			pastDueSubscriptions: pastDue,
			totalMrr: Math.round(totalMrr),
			totalArr: Math.round(totalMrr * 12),
			currency: "USD",
			totalCustomers,
			localUserCount,
			paidUserCount,
		};
	});
