import type { Middleware } from "@orpc/server";
import type { SubscriptionStatus } from "@prisma/client";
import {
	type AuthSessionType,
	auth,
	type ExtendedUser,
} from "@/lib/auth/better-auth";
import type { ORPCContext } from "../context";
import type { Role, Tier } from "../helpers/constants";
import { userHasPermission } from "../helpers/permission.server";
import type { AppErrorMap } from "../root";

export interface AuthContext extends AuthSessionType {}

type AppMiddleware<
	TInContext extends ORPCContext,
	TOutContext extends ORPCContext,
	TInput = unknown,
	TOutput = unknown,
> = Middleware<TInContext, TOutContext, TInput, TOutput, AppErrorMap, {}>;

export const withAuth: AppMiddleware<
	ORPCContext,
	ORPCContext & AuthContext
> = async ({ next, context }) => {
	const sessionData = await auth.api.getSession();
	if (!sessionData) {
		throw new Error("UNAUTHENTICATED");
	}
	const { user, session } = sessionData;
	const typedUser = user as ExtendedUser;
	return next({ context: { ...context, user: typedUser, session } });
};

export const requireSubscription =
	(
		tiers: Tier | Tier[],
	): AppMiddleware<ORPCContext & AuthContext, ORPCContext & AuthContext> =>
	async ({ next, context }) => {
		const allowed = Array.isArray(tiers) ? tiers : [tiers];
		const status = (context as AuthContext).user
			?.subscriptionStatus as SubscriptionStatus;
		if (!allowed.includes(status as Tier)) {
			throw new Error("SUBSCRIPTION_REQUIRED");
		}
		return next({ context });
	};

export const requireRole =
	(
		role: Role,
	): AppMiddleware<ORPCContext & AuthContext, ORPCContext & AuthContext> =>
	async ({ next, context }) => {
		if ((context as AuthContext).user?.role !== role) {
			throw new Error("FORBIDDEN");
		}
		return next({ context });
	};

export const requireAdmin =
	(): AppMiddleware<ORPCContext & AuthContext, ORPCContext & AuthContext> =>
	async ({ next, context }) => {
		if ((context as AuthContext).user?.role !== "ADMIN") {
			throw new Error("UNAUTHORIZED");
		}
		return next({ context });
	};

export const withRequire =
	(options: {
		role?: Role;
		permission?: { resource: string; action: string };
	}): AppMiddleware<ORPCContext & AuthContext, ORPCContext & AuthContext> =>
	async ({ next, context }) => {
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
	};
