import { os } from "@orpc/server";
import SuperJSON from "superjson";

import type { DatabaseClient } from "@/server/db";
import type { AuthContext } from "../middleware/middleware";
import {
	requireAdmin,
	requireSubscription,
	withAuth,
	withRequire,
} from "../middleware/middleware";

import { withDb } from "../middleware/with-db";

export type ORPCContext = { db: DatabaseClient; auth: AuthContext };

export const base = os.$context<ORPCContext>().errors({
	NOT_FOUND: {
		status: 404,
		message: "Not Found",
	},
	UNAUTHORIZED: {
		status: 401,
		message: "Unauthorized",
	},
	FORBIDDEN: {
		status: 403,
		message: "Forbidden",
	},
	BAD_REQUEST: {
		status: 400,
		message: "Bad Request",
	},
	CONFLICT: {
		status: 409,
		message: "Conflict",
	},
	TOO_MANY_REQUESTS: {
		status: 429,
		message: "Too Many Requests",
	},
});

export const publicProcedure = base.use(withDb);

export const authedProcedure = publicProcedure.use(withAuth);

export const adminProcedure = authedProcedure.use(requireAdmin());

export const subscribedProcedure = authedProcedure.use(
	requireSubscription(["PREMIUM", "FAMILY"]),
);

export const premiumProcedure = authedProcedure.use(
	requireSubscription(["PREMIUM", "FAMILY"]),
);

export const collectionCreateProcedure = authedProcedure.use(
	withRequire({
		role: "ADMIN",
		permission: { resource: "collection", action: "create" },
	}),
);

export const collectionUpdateProcedure = authedProcedure.use(
	withRequire({
		role: "ADMIN",
		permission: { resource: "collection", action: "update" },
	}),
);

export const collectionDeleteProcedure = authedProcedure.use(
	withRequire({
		role: "ADMIN",
		permission: { resource: "collection", action: "delete" },
	}),
);

export const roleProcedure = authedProcedure.use(
	withRequire({ role: "ADMIN" }),
);
