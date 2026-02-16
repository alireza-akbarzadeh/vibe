import type { AuthContext } from "../middleware/middleware";
import {
	requireAdmin,
	requireSubscription,
	withAuth,
	withRequire,
} from "../middleware/middleware";
import { base } from "../router/base";

/* -------------------------------------------------------------------------- */
/*                              BASE CONTEXT                                  */
/* -------------------------------------------------------------------------- */

export type ORPCContext = Partial<AuthContext>;

// Use the base with error definitions
export const publicProcedure = base.$context<ORPCContext>();

/* -------------------------------------------------------------------------- */
/*                            AUTHED PROCEDURE                                */
/* -------------------------------------------------------------------------- */

export const authedProcedure = publicProcedure.use(withAuth);

/* -------------------------------------------------------------------------- */
/*                             ADMIN PROCEDURE                                */
/* -------------------------------------------------------------------------- */

export const adminProcedure = publicProcedure.use(withAuth).use(requireAdmin());

/* -------------------------------------------------------------------------- */
/*                        SUBSCRIBED PROCEDURE                                 */
/* -------------------------------------------------------------------------- */

export const subscribedProcedure = publicProcedure
	.use(withAuth)
	.use(requireSubscription(["PREMIUM", "FAMILY"]));

/* -------------------------------------------------------------------------- */
/*                        PREMIUM ONLY PROCEDURE                              */
/* -------------------------------------------------------------------------- */

export const premiumProcedure = publicProcedure
	.use(withAuth)
	.use(requireSubscription(["PREMIUM", "FAMILY"]));

/* -------------------------------------------------------------------------- */
/*                      COLLECTION ADMIN PROCEDURES                           */
/* -------------------------------------------------------------------------- */

export const collectionCreateProcedure = publicProcedure.use(
	withRequire({
		role: "ADMIN",
		permission: { resource: "collection", action: "create" },
	}),
);

export const collectionUpdateProcedure = publicProcedure.use(
	withRequire({
		role: "ADMIN",
		permission: { resource: "collection", action: "update" },
	}),
);

export const collectionDeleteProcedure = publicProcedure.use(
	withRequire({
		role: "ADMIN",
		permission: { resource: "collection", action: "delete" },
	}),
);

/* -------------------------------------------------------------------------- */
/*                         ROLE MANAGEMENT PROCEDURE                          */
/* -------------------------------------------------------------------------- */

export const roleProcedure = publicProcedure.use(
	withRequire({ role: "ADMIN" }),
);
