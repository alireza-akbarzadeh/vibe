import { prisma } from "@/lib/db";
import { os } from "@orpc/server";

export const withDb = os.middleware(async ({ next }) => {
	return next({ context: { db: prisma } });
});
