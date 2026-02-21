import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db.server";

export async function auditLog(params: {
	userId: string;
	action: string;
	resource: string;
	resourceId?: string;
	metadata?: Prisma.InputJsonValue;
}) {
	await prisma.auditLog.create({
		data: params,
	});
}
