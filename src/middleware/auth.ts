import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import type { getSession } from "@/lib/auth/auth-server";
import { prisma } from "@/lib/db.server";

interface MyRouterContext {
	queryClient: QueryClient;
	auth: Awaited<ReturnType<typeof getSession>>;
}

export const authMiddleware = createMiddleware().server(
	async ({ next, context }) => {
		const auth = (context as unknown as MyRouterContext).auth;

		if (!auth) {
			throw redirect({ to: "/login" });
		}

		return await next();
	},
);

export const adminMiddleware = createMiddleware().server(
	async ({ next, request, context }) => {
		const auth = (context as unknown as MyRouterContext).auth;

		// Check if session exists
		if (!auth || !auth.user) {
			throw redirect({ to: "/login" });
		}

		// Check if user has ADMIN role (uppercase as stored in DB)
		const userRole = auth.user.role as string;
		if (!userRole || userRole !== "ADMIN") {
			throw redirect({
				to: "/unauthorized",
				search: {
					error: "unauthorized",
					from: request.url,
					requiredRole: "ADMIN",
				},
			});
		}

		return await next();
	},
);

type SubscriptionLevel = "PRO" | "PREMIUM";

export const requireSubscription = (requiredLevel: SubscriptionLevel = "PRO") =>
	createMiddleware().server(async ({ next, context }) => {
		const auth = (context as unknown as MyRouterContext).auth;

		if (!auth) {
			throw redirect({ to: "/login" });
		}

		const { subscriptionStatus } = auth.user;

		// Check subscription status
		if (subscriptionStatus === "CANCELLED" || subscriptionStatus === "FREE") {
			throw redirect({
				to: "/pricing",
			});
		}

		// If required PREMIUM but user has PRO
		if (requiredLevel === "PREMIUM" && subscriptionStatus !== "PREMIUM") {
			throw redirect({
				to: "/pricing",
			});
		}

		return await next();
	});

export const verifiedEmailMiddleware = createMiddleware().server(
	async ({ next, request, context }) => {
		const auth = (context as unknown as MyRouterContext).auth;

		if (!auth) {
			throw redirect({ to: "/login" });
		}

		if (!auth.user.emailVerified) {
			throw redirect({
				to: "/verify-email",
				search: { email: auth.user.email, redirectUrl: request.url },
			});
		}

		return await next();
	},
);

export const requirePermission = (resource: string, action: string) =>
	createMiddleware().server(async ({ next, context }) => {
		const auth = (context as unknown as MyRouterContext).auth;

		if (!auth) {
			throw redirect({ to: "/login" });
		}

		// Check if user has direct permission
		const userPermission = await prisma.userPermission.findFirst({
			where: {
				userId: auth.user.id,
				permission: {
					resource,
					action,
				},
				OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			},
		});

		if (userPermission) {
			return await next();
		}

		// Check if user's roles have this permission
		const rolePermission = await prisma.rolePermission.findFirst({
			where: {
				role: {
					users: {
						some: { userId: auth.user.id },
					},
				},
				permission: {
					resource,
					action,
				},
			},
		});

		if (!rolePermission) {
			throw redirect({
				to: "/",
				search: { error: "forbidden" },
			});
		}

		return await next();
	});

export const proMiddleware = requireSubscription("PRO");
export const premiumMiddleware = requireSubscription("PREMIUM");

interface RequireOptions {
	verified?: boolean;
	role?: "user" | "admin";
	subscription?: "PRO" | "PREMIUM";
}

export const require = (options: RequireOptions = {}) =>
	createMiddleware().server(async ({ next, context }) => {
		const auth = (context as unknown as MyRouterContext).auth;

		// 1. Auth check
		if (!auth) {
			throw redirect({ to: "/login" });
		}

		// 2. Verified email check
		if (options.verified && !auth.user.emailVerified) {
			throw redirect({
				to: "/verify-email",
				search: { email: auth.user.email, redirectUrl: undefined },
			});
		}

		// 3. Role check
		if (options.role && auth.user.role !== options.role) {
			throw redirect({ to: "/" });
		}

		// 4. Subscription check
		if (options.subscription) {
			const { subscriptionStatus } = auth.user;

			if (subscriptionStatus === "CANCELLED" || subscriptionStatus === "FREE") {
				throw redirect({
					to: "/pricing",
				});
			}

			if (
				options.subscription === "PREMIUM" &&
				subscriptionStatus !== "PREMIUM"
			) {
				throw redirect({
					to: "/pricing",
				});
			}
		}

		return await next();
	});
