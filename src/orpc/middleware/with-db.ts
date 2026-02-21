import { os } from "@orpc/server";

export const withDb = os.middleware(async ({ next }) => {
	const { db } = await import("@/lib/db.server");
	return next({ context: { db } });
});
