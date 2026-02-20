import type { Middleware } from "@orpc/server";
import type { SubscriptionStatus } from "@prisma/client";
import { type AuthSessionType, auth } from "@/lib/auth/better-auth";
import type { ORPCContext } from "../context";
import type { Role, Tier } from "../helpers/constants";
import { userHasPermission } from "../helpers/helper";

export interface AuthContext extends AuthSessionType {}

export const withAuth: Middleware<ORPCContext> = async ({ next, ctx }) => {
	const sessionData = await auth.api.getSession();
	if (!sessionData) {
		throw new Error("UNAUTHENTICATED");
	}
	const { user, session } = sessionData;
	return next({ ctx: { ...ctx, user, session } });
};

export const requireSubscription =
	(tiers: Tier | Tier[]): Middleware<ORPCContext> =>
	async ({ next, ctx }) => {
		const allowed = Array.isArray(tiers) ? tiers : [tiers];
		const status = (ctx as AuthContext).user
			?.subscriptionStatus as SubscriptionStatus;
		if (!allowed.includes(status as Tier)) {
			throw new Error("SUBSCRIPTION_REQUIRED");
		}
		return next({ ctx });
	};

export const requireRole =
	(role: Role): Middleware<ORPCContext> =>
	async ({ next, ctx }) => {
		if ((ctx as AuthContext).user?.role !== role) {
			throw new Error("FORBIDDEN");
		}
		return next({ ctx });
	};

export const requireAdmin =
	(): Middleware<ORPCContext> =>
	async ({ next, ctx }) => {
		if ((ctx as AuthContext).user?.role !== "ADMIN") {
			throw new Error("UNAUTHORIZED");
		}
		return next({ ctx });
	};

export const withRequire =
	(options: {
		role?: Role;
		permission?: { resource: string; action: string };
	}): Middleware<ORPCContext> =>
	async ({ next, ctx }) => {
		if (!(ctx as AuthContext).user) {
			throw new Error("UNAUTHENTICATED");
		}
		if (options.role && (ctx as AuthContext).user.role !== options.role) {
			throw new Error("FORBIDDEN");
		}
		if (
			options.permission &&
			!userHasPermission(
				(ctx as AuthContext).user.id,
				options.permission.resource,
				options.permission.action,
			)
		) {
			throw new Error("FORBIDDEN");
		}
		return next({ ctx });
	};
