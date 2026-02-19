import { createFileRoute } from "@tanstack/react-router";
import { polarClient } from "@/integrations/polar/polar-client";
import { getSession } from "@/lib/auth/auth-server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/api/subscription/cancel")({
	server: {
		handlers: {
			POST: async () => {
				try {
					// Check authentication
					const session = await getSession();
					if (!session?.user) {
						return new Response(
							JSON.stringify({
								error: "Unauthorized - Please login to continue",
							}),
							{
								status: 401,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const user = await prisma.user.findUnique({
						where: { id: session.user.id },
						select: {
							id: true,
							customerId: true,
							subscriptionStatus: true,
							currentPlan: true,
						},
					});

					if (!user) {
						return new Response(JSON.stringify({ error: "User not found" }), {
							status: 404,
							headers: { "Content-Type": "application/json" },
						});
					}

					// Check if user has an active subscription
					if (!user.customerId) {
						return new Response(
							JSON.stringify({ error: "No active subscription found" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Get active subscriptions from Polar
					let subscriptionId: string | undefined;
					try {
						const subs = await polarClient.subscriptions.list({
							customerId: user.customerId,
							active: true,
						});
						subscriptionId = subs?.result?.items?.[0]?.id;
					} catch (err) {
						logger.error("Failed to fetch subscriptions from Polar:", err);
						return new Response(
							JSON.stringify({ error: "Failed to fetch subscription details" }),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					if (!subscriptionId) {
						return new Response(
							JSON.stringify({
								error: "No active subscription found",
								alreadyCancelled: true,
							}),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Cancel the subscription (will end at period end)
					try {
						await polarClient.subscriptions.update({
							id: subscriptionId,
							subscriptionUpdate: {
								cancelAtPeriodEnd: true,
							},
						});

						// Update user status to CANCELLED
						await prisma.user.update({
							where: { id: user.id },
							data: { subscriptionStatus: "CANCELLED" },
						});

						logger.info(
							`[Cancel Subscription] Subscription ${subscriptionId} scheduled for cancellation for user ${session.user.email}`,
						);

						return new Response(
							JSON.stringify({
								success: true,
								message:
									"Subscription will be cancelled at the end of the billing period",
								pendingCancellation: true,
							}),
							{
								status: 200,
								headers: { "Content-Type": "application/json" },
							},
						);
					} catch (err) {
						const errorMessage = String(err);

						// Handle already cancelled subscription
						if (errorMessage.includes("AlreadyCanceledSubscription")) {
							await prisma.user.update({
								where: { id: user.id },
								data: { subscriptionStatus: "CANCELLED" },
							});

							return new Response(
								JSON.stringify({
									success: true,
									message: "Subscription is already cancelled",
									alreadyCancelled: true,
								}),
								{
									status: 200,
									headers: { "Content-Type": "application/json" },
								},
							);
						}

						// Handle authentication errors
						if (
							errorMessage.includes("Unauthorized") ||
							errorMessage.includes("invalid_token")
						) {
							logger.error("Polar authentication failed:", err);
							return new Response(
								JSON.stringify({
									error: "Payment provider authentication failed",
								}),
								{
									status: 500,
									headers: { "Content-Type": "application/json" },
								},
							);
						}

						// Generic error
						logger.error("Failed to cancel subscription:", err);
						return new Response(
							JSON.stringify({ error: "Failed to cancel subscription" }),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}
				} catch (error) {
					logger.error("Unexpected error in cancel subscription:", error);
					return new Response(
						JSON.stringify({ error: "An unexpected error occurred" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
