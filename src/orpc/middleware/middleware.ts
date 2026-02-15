import type { SubscriptionStatus } from "@/generated/prisma/enums";
import type { Role, Tier } from "../helpers/constants";
import { userHasPermission } from "../helpers/helper";
import { base } from "../router/base";

type SessionType = NonNullable<Awaited<ReturnType<typeof import("@/lib/auth/better-auth").auth.api.getSession>>>;

export interface AuthContext {
	user: SessionType["user"];
	session: SessionType["session"];
}

/* -------------------------------------------------------------------------- */
/*                              AUTH MIDDLEWARE                               */
/* -------------------------------------------------------------------------- */

export const withAuth = base
	.$context<Partial<AuthContext>>()
	.middleware(async ({ next, errors, context }) => {
		// Use session from context (already set by API handler)
		if (!context?.user || !context?.session) {
			throw errors.UNAUTHENTICATED();
		}

		return next({
			context: {
				user: context.user,
				session: context.session,
			},
		});
	});

/* -------------------------------------------------------------------------- */
/*                        SUBSCRIPTION MIDDLEWARE                             */
/* -------------------------------------------------------------------------- */

export const requireSubscription = (tiers: Tier | Tier[]) =>
	base.$context<AuthContext>().middleware(({ next, context, errors }) => {
		const allowed = Array.isArray(tiers) ? tiers : [tiers];
		const status = context.user.subscriptionStatus as SubscriptionStatus;

		if (!allowed.includes(status as Tier)) {
			throw errors.SUBSCRIPTION_REQUIRED({
				data: {
					required: allowed[0].toLowerCase(),
					upgrade: true,
				},
			});
		}

		return next({ context });
	});

/* -------------------------------------------------------------------------- */
/*                               ADMIN MIDDLEWARE                             */
/* -------------------------------------------------------------------------- */

export const requireAdmin = (roles?: Role | Role[]) =>
	base.$context<AuthContext>().middleware(({ next, context, errors }) => {
		const allowed = roles
			? Array.isArray(roles)
				? roles
				: [roles]
			: ["ADMIN"];

		// Case-insensitive role comparison
		const userRole = (context.user.role as string)?.toUpperCase();
		const allowedRoles = allowed.map(r => r.toUpperCase());

		if (!allowedRoles.includes(userRole)) {
			throw errors.FORBIDDEN({
				message: "Admin access required",
			});
		}

		return next({ context });
	});

/* -------------------------------------------------------------------------- */
/*                         PERMISSION MIDDLEWARE                              */
/* -------------------------------------------------------------------------- */

export const requirePermission = (resource: string, action: string) =>
	base.$context<AuthContext>().middleware(async ({ next, context, errors }) => {
		const hasPermission = await userHasPermission(
			context.user.id,
			resource,
			action,
		);

		if (!hasPermission) {
			throw errors.FORBIDDEN({
				message: `Permission denied: ${resource}:${action}`,
			});
		}

		return next({ context });
	});

type RequireOptions = {
	role?: Role | Role[];
	permission?: {
		resource: string;
		action: string;
	};
};

export const withRequire = (options: RequireOptions) =>
	base.$context<Partial<AuthContext>>().middleware(async ({ next, errors, context }) => {
		// Use session from context (already set by API handler)
		if (!context?.user || !context?.session) {
			throw errors.UNAUTHENTICATED();
		}

		const user = context.user;
		const session = context.session;

		/* ---------------------------------------------------------------------- */
		/*                                ROLE CHECK                               */
		/* ---------------------------------------------------------------------- */
		if (options.role) {
			const allowedRoles = Array.isArray(options.role)
				? options.role
				: [options.role];

			if (allowedRoles.includes(user.role as Role)) {
				return next({
					context: { user, session },
				});
			}
		}

		/* ---------------------------------------------------------------------- */
		/*                             PERMISSION CHECK                            */
		/* ---------------------------------------------------------------------- */
		if (options.permission) {
			const { resource, action } = options.permission;

			const hasPermission = await userHasPermission(user.id, resource, action);

			if (hasPermission) {
				return next({
					context: { user, session },
				});
			}
		}

		throw errors.FORBIDDEN({
			message: "You don't have permission to perform this action",
		});
	});
