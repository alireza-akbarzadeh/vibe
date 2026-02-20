import { os } from "@orpc/server";

export const withDb = os.middleware(async ({ next }) => {
	const { prisma } = await import("@/lib/db.server");
	return next({ context: { db: prisma } });
});
