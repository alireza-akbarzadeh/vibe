import { z } from "zod";
import {
	POLAR_PRODUCT_TO_PLAN,
	polarClient,
} from "@/integrations/polar/polar-client";
import { authedProcedure, publicProcedure } from "@/orpc/context";

/**
 * Get webhook statistics and recent events
 * Admin only endpoint
 */
export const getWebhookStats = authedProcedure
	.input(
		z.object({
			limit: z.number().min(1).max(50).default(10),
		}),
	)
	.output(
		z.object({
			totalProcessed: z.number(),
			recentEvents: z.array(
				z.object({
					type: z.string(),
					timestamp: z.string(),
					processed: z.boolean(),
				}),
			),
		}),
	)
	.handler(async ({ context }) => {
		if (context.user.role !== "ADMIN") {
			throw new Error("You are not authorized to perform this action");
		}
		// This is a placeholder - in production you'd store webhook events
		// in your database and query them here
		return {
			totalProcessed: 0,
			recentEvents: [],
		};
	});

/**
 * Sync subscription status from Polar
 * Useful for manual reconciliation
 */
export const syncSubscriptionStatus = authedProcedure
	.input(z.object({ userId: z.string() }))
	.output(
		z.object({
			success: z.boolean(),
			message: z.string(),
			updatedStatus: z.string().optional(),
		}),
	)
	.handler(async ({ input, context }) => {
		try {
			const user = await context.db.user.findUnique({
				where: { id: input.userId },
				select: { id: true, customerId: true, subscriptionStatus: true },
			});

			if (!user || !user.customerId) {
				throw new Error("User or customer not found");
			}

			// Get active subscriptions from Polar
			const subscriptions = await polarClient.subscriptions.list({
				customerId: user.customerId,
				limit: 10,
			});

			const activeSubscription = subscriptions.result.items.find(
				(sub) => sub.status === "active" || sub.status === "trialing",
			);

			let newStatus: string;
			let newPlan: string | null = null;

			if (activeSubscription) {
				// Map product to plan
				newPlan = POLAR_PRODUCT_TO_PLAN[activeSubscription.productId] || "FREE";
				newStatus = activeSubscription.status === "active" ? "ACTIVE" : "FREE";
			} else {
				newStatus = "FREE";
			}

			// Update user
			await context.db.user.update({
				where: { id: user.id },
				data: {
					subscriptionStatus: newStatus,
					currentPlan: newPlan,
				},
			});

			return {
				success: true,
				message: "Subscription status synced successfully",
				updatedStatus: newStatus,
			};
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "An unknown error occurred",
			};
		}
	});
