/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

import { os } from "@orpc/server";
import type { AuthContext } from "../middleware/middleware";

/* -------------------------------------------------------------------------- */

export const adminOnly = os
	.$context<{ auth: AuthContext }>()
	.middleware(({ context, next }) => {
		if (!context.auth?.user || context.auth.user.role !== "ADMIN") {
			throw {
				code: "FORBIDDEN",
				status: 403,
				message: "Admin access required",
			};
		}
		return next({ context });
	});
