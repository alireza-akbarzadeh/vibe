import { base } from "../errors/error";
import type { AuthContext } from "../middleware/middleware";
import {
	requireAdmin,
	requireSubscription,
	withAuth,
} from "../middleware/middleware";

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
	.use(requireSubscription(["PRO"]));

/* -------------------------------------------------------------------------- */
/*                        PREMIUM ONLY PROCEDURE                              */
/* -------------------------------------------------------------------------- */

export const premiumProcedure = publicProcedure
	.use(withAuth)
	.use(requireSubscription("PRO"));
