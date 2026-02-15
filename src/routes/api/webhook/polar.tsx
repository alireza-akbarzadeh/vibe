import { Webhooks } from "@polar-sh/tanstack-start";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";
import { polarClient } from "@/integrations/polar/polar-client";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

// Helper function to find/link user by customer ID
async function findOrLinkUser(customerId: string) {
    // Find user by Polar customer ID
    let user = await prisma.user.findFirst({
        where: { customerId },
    });

    // If user not found by customerId, try to find by email and link customer
    if (!user && customerId) {
        try {
            // Fetch customer details from Polar
            const customer = await polarClient.customers.get({ id: customerId });

            if (customer.email) {
                // Find user by email
                user = await prisma.user.findFirst({
                    where: { email: customer.email },
                });

                // Link the Polar customer to the user
                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { customerId },
                    });
                    logger.info(
                        `[Polar Webhook] Linked customer ${customerId} to user ${user.email}`,
                    );
                }
            }
        } catch (error) {
            logger.error(
                `[Polar Webhook] Failed to fetch customer ${customerId}:`,
                error,
            );
        }
    }

    return user;
}

export const Route = createFileRoute("/api/webhook/polar")({
    server: {
        handlers: {
            POST: Webhooks({
                webhookSecret: env.POLAR_WEBHOOK_SECRET,

                // Triggered when an order is paid (one-time purchase or subscription renewal)
                onOrderPaid: async (payload) => {
                    const order = payload.data;
                    const customerId = order.customerId;
                    const productId = order.productId;

                    const user = await findOrLinkUser(customerId);

                    if (!user) {
                        logger.warn(
                            `[Polar Webhook] User not found for customer ${customerId}`,
                        );
                        return;
                    }

                    // Determine subscription status based on product
                    let subscriptionStatus: "PREMIUM" | "FAMILY" = "PREMIUM";

                    // Get plan name from product
                    const planName = order.product?.name || productId;

                    // Update this mapping based on your actual product IDs
                    if (
                        productId === env.POLAR_FAMILY_MONTHLY_PRODUCT_ID ||
                        productId === env.POLAR_FAMILY_YEARLY_PRODUCT_ID
                    ) {
                        subscriptionStatus = "FAMILY";
                    }

                    // Update user subscription status and current plan
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            subscriptionStatus,
                            currentPlan: planName,
                        },
                    });

                    // Create or update subscription record
                    if (order.subscriptionId) {
                        // Find existing subscription
                        const existingSubscription = await prisma.subscription.findFirst({
                            where: {
                                userId: user.id,
                                referenceId: order.subscriptionId,
                            },
                        });

                        if (existingSubscription) {
                            // Update existing subscription
                            await prisma.subscription.update({
                                where: { id: existingSubscription.id },
                                data: { status: subscriptionStatus },
                            });
                        } else {
                            // Create new subscription
                            await prisma.subscription.create({
                                data: {
                                    userId: user.id,
                                    productId: order.productId || "unknown",
                                    referenceId: order.subscriptionId,
                                    status: subscriptionStatus,
                                    startedAt: new Date(),
                                },
                            });
                        }
                    }

                    logger.info(
                        `[Polar Webhook] Order paid for user ${user.email}: ${subscriptionStatus}`,
                    );
                },

                // Triggered when a subscription becomes active
                onSubscriptionActive: async (payload) => {
                    const subscription = payload.data;
                    const customerId = subscription.customerId;
                    const productId = subscription.productId;

                    const user = await findOrLinkUser(customerId);

                    if (!user) {
                        logger.warn(
                            `[Polar Webhook] User not found for customer ${customerId}`,
                        );
                        return;
                    }

                    let subscriptionStatus: "PREMIUM" | "FAMILY" = "PREMIUM";

                    // Get plan name from product
                    const planName = subscription.product?.name || productId;

                    if (
                        productId === env.POLAR_FAMILY_MONTHLY_PRODUCT_ID ||
                        productId === env.POLAR_FAMILY_YEARLY_PRODUCT_ID
                    ) {
                        subscriptionStatus = "FAMILY";
                    }

                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            subscriptionStatus,
                            currentPlan: planName,
                        },
                    });

                    // Create or update subscription record
                    const existingSubscription = await prisma.subscription.findFirst({
                        where: {
                            userId: user.id,
                            referenceId: subscription.id,
                        },
                    });

                    if (existingSubscription) {
                        await prisma.subscription.update({
                            where: { id: existingSubscription.id },
                            data: { status: subscriptionStatus },
                        });
                    } else {
                        await prisma.subscription.create({
                            data: {
                                userId: user.id,
                                productId: subscription.productId || "unknown",
                                referenceId: subscription.id,
                                status: subscriptionStatus,
                                startedAt: new Date(),
                                canceledAt: subscription.canceledAt,
                                endedAt: subscription.endedAt,
                            },
                        });
                    }

                    logger.info(
                        `[Polar Webhook] Subscription activated for user ${user.email}`,
                    );
                },

                // Triggered when a subscription is canceled
                onSubscriptionCanceled: async (payload) => {
                    const subscription = payload.data;
                    const customerId = subscription.customerId;

                    const user = await findOrLinkUser(customerId);

                    if (!user) {
                        logger.warn(
                            `[Polar Webhook] User not found for customer ${customerId}`,
                        );
                        return;
                    }

                    // Update user to FREE tier
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            subscriptionStatus: "FREE",
                            currentPlan: null,
                        },
                    });

                    // Mark subscription as canceled
                    await prisma.subscription.updateMany({
                        where: {
                            userId: user.id,
                            referenceId: subscription.id,
                        },
                        data: {
                            status: "CANCELLED",
                            canceledAt: new Date(),
                        },
                    });

                    logger.info(
                        `[Polar Webhook] Subscription canceled for user ${user.email}`,
                    );
                },

                // Triggered when a subscription is revoked (e.g., payment failed)
                onSubscriptionRevoked: async (payload) => {
                    const subscription = payload.data;
                    const customerId = subscription.customerId;

                    const user = await findOrLinkUser(customerId);

                    if (!user) {
                        logger.warn(
                            `[Polar Webhook] User not found for customer ${customerId}`,
                        );
                        return;
                    }

                    // Update user to FREE tier
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            subscriptionStatus: "FREE",
                            currentPlan: null,
                        },
                    });

                    // Mark subscription as canceled
                    await prisma.subscription.updateMany({
                        where: {
                            userId: user.id,
                            referenceId: subscription.id,
                        },
                        data: {
                            status: "CANCELLED",
                            canceledAt: new Date(),
                        },
                    });

                    logger.info(
                        `[Polar Webhook] Subscription revoked for user ${user.email}`,
                    );
                },

                // Catch-all for debugging other events
                onPayload: async (payload) => {
                    // Log all events for debugging (filter out organization.updated as it's noisy)
                    if (payload.type !== "organization.updated") {
                        logger.info(
                            `[Polar Webhook] Received event: ${payload.type}`,
                            JSON.stringify(payload, null, 2),
                        );
                    }
                },
            }),
        },
    },
});
