import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db.server";

export async function auditLog(params: {
	userId: string;
	action: string;
	resource: string;
	resourceId?: string;
	metadata?: Prisma.InputJsonValue;
}) {
	await db.client.auditLog.create({
		data: params,
	});
}
