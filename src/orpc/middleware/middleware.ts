import { os } from "@orpc/server";
import type { SubscriptionStatus } from "@prisma/client";
import { type AuthSessionType, auth } from "@/lib/auth/better-auth";
import type { ORPCContext } from "../context";
import type { Role, Tier } from "../helpers/constants";
import { userHasPermission } from "../helpers/helper";

export interface AuthContext extends AuthSessionType {}

export const withAuth = os
	.$context<ORPCContext>()
	.middleware(async ({ next, context }) => {
		const { session, user } = await auth.api.getSession();

		if (!user || !session) {
			throw new Error("UNAUTHENTICATED");
		}

		return next({ context: { ...context, user, session } });
	});

export const requireSubscription = (tiers: Tier | Tier[]) =>
	os.$context<ORPCContext>().middleware(({ next, context }) => {
		const allowed = Array.isArray(tiers) ? tiers : [tiers];
		const status = (context as AuthContext).user
			?.subscriptionStatus as SubscriptionStatus;

		if (!allowed.includes(status as Tier)) {
			throw new Error("SUBSCRIPTION_REQUIRED");
		}

		return next({ context });
	});

export const requireRole = (role: Role) =>
	os.$context<ORPCContext>().middleware(({ next, context }) => {
		if ((context as AuthContext).user?.role !== role) {
			throw new Error("FORBIDDEN");
		}

		return next({ context });
	});

export const requireAdmin = () =>
	os.$context<ORPCContext>().middleware(async ({ next, context }) => {
		if ((context as AuthContext).user?.role !== "ADMIN") {
			throw new Error("UNAUTHORIZED");
		}

		return next({ context });
	});

export const withRequire = (options: {
	role?: Role;
	permission?: { resource: string; action: string };
}) =>
	os.$context<ORPCContext>().middleware(({ next, context }) => {
		if (!(context as AuthContext).user) {
			throw new Error("UNAUTHENTICATED");
		}
		if (options.role && (context as AuthContext).user.role !== options.role) {
			throw new Error("FORBIDDEN");
		}

		if (
			options.permission &&
			!userHasPermission(
				(context as AuthContext).user.id,
				options.permission.resource,
				options.permission.action,
			)
		) {
			throw new Error("FORBIDDEN");
		}

		return next({ context });
	});
