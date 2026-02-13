/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

import { os } from "@orpc/server";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/better-auth";
import { prisma } from "@/lib/db";
import { unauthorized } from "../errors/error";
import type { AuthContext } from "../middleware/middleware";

/* -------------------------------------------------------------------------- */
/*                           Internal Helper Logic                            */
/* -------------------------------------------------------------------------- */

export async function getSessionOrThrow() {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });

	if (!session) {
		throw unauthorized();
	}

	return session;
}

export async function userHasPermission(
	userId: string,
	resource: string,
	action: string,
) {
	const result = await prisma.user.findFirst({
		where: { id: userId },
		select: {
			permissions: {
				where: {
					permission: { resource, action },
					OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
				},
				take: 1,
			},
			roles: {
				where: {
					role: {
						permissions: {
							some: {
								permission: { resource, action },
							},
						},
					},
				},
				take: 1,
			},
		},
	});

	return !!result?.permissions?.length || !!result?.roles?.length;
}

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
