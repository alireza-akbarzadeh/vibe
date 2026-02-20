import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";

const ListAuditLogsInputSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(50),
	userId: z.string().optional(),
	action: z.string().optional(),
	resource: z.string().optional(),
});

const AuditLogResponseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	action: z.string(),
	resource: z.string(),
	resourceId: z.string().nullable(),
	metadata: z.any(),
	createdAt: z.string().datetime(),
});

export const listAuditLogs = authedProcedure
	.input(ListAuditLogsInputSchema)
	.output(
		z.object({
			logs: z.array(AuditLogResponseSchema),
			total: z.number(),
			page: z.number(),
			limit: z.number(),
			totalPages: z.number(),
		}),
	)
	.handler(async ({ input }) => {
		const { page, limit, userId, action, resource } = input;
		const skip = (page - 1) * limit;

		// Build where clause
		const where: Prisma.AuditLogWhereInput = {};

		if (userId) {
			where.userId = userId;
		}

		if (action) {
			where.action = { contains: action, mode: "insensitive" };
		}

		if (resource) {
			where.resource = { contains: resource, mode: "insensitive" };
		}

		// Get total count
		const total = await prisma.auditLog.count({ where });

		// Get audit logs
		const logs = await prisma.auditLog.findMany({
			where,
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
		});

		const totalPages = Math.ceil(total / limit);

		return {
			logs: logs.map((log) => ({
				...log,
				createdAt: log.createdAt.toISOString(),
			})),
			total,
			page,
			limit,
			totalPages,
		};
	});
