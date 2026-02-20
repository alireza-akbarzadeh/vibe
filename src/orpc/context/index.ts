import type { DatabaseClient } from "@/server/db";
import type { AuthContext } from "../middleware/middleware";
import {
	requireAdmin,
	requireSubscription,
	withAuth,
	withRequire,
} from "../middleware/middleware";
import { os } from "../root";

// Define the shape of our context
export type ORPCContext = { db: DatabaseClient } & Partial<AuthContext>;

// Create a base procedure builder with the context type and error definitions
export const base = os;

// The public procedure is the base procedure. The context is injected at the request handler.
export const publicProcedure = base;

// Create more specific procedures by chaining middleware
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
