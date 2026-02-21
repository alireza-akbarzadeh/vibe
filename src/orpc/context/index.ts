import type { DatabaseClient } from "@/server/db";
import type { AuthContext } from "../middleware/middleware";
import {
	requireAdmin,
	requireSubscription,
	withAuth,
	withRequire,
} from "../middleware/middleware";
import { os } from "../root";

export type ORPCContext = { db: DatabaseClient } & Partial<AuthContext>;

export const base = os;
export const publicProcedure = base;

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
