import { adminProcedure } from "@/orpc/context";
import { assignUserPermissionInput, removeUserPermissionInput } from "@/orpc/models/user-access";
import { prisma } from "@/lib/db";
import { auditLog } from "./audit";
import { z } from "zod";

export const assignUserPermission = adminProcedure
	.input(assignUserPermissionInput)
	.output(z.object({ success: z.boolean() }))
	.handler(async ({ input, context }) => {
		const { userId, permissionId, expiresAt } = input;

		// Check if permission already exists
		const existing = await prisma.userPermission.findUnique({
			where: {
				userId_permissionId: {
					userId,
					permissionId,
				},
			},
		});

		if (existing) {
			throw new Error("User already has this permission");
		}

		// Assign permission
		await prisma.userPermission.create({
			data: {
				userId,
				permissionId,
				grantedBy: context.user?.id,
				expiresAt: expiresAt ? new Date(expiresAt) : null,
			},
		});

		// Audit log
		await auditLog({
			userId: context.user?.id ?? "",
			action: "assign_permission",
			resource: "user_permission",
			resourceId: `${userId}:${permissionId}`,
			metadata: { userId, permissionId, expiresAt },
		});

		return { success: true };
	});

export const removeUserPermission = adminProcedure
	.input(removeUserPermissionInput)
	.output(z.object({ success: z.boolean() }))
	.handler(async ({ input, context }) => {
		const { userId, permissionId } = input;

		// Remove permission
		const deleted = await prisma.userPermission.delete({
			where: {
				userId_permissionId: {
					userId,
					permissionId,
				},
			},
		});

		if (!deleted) {
			throw new Error("Permission not found");
		}

		// Audit log
		await auditLog({
			userId: context.user?.id ?? "",
			action: "remove_permission",
			resource: "user_permission",
			resourceId: `${userId}:${permissionId}`,
			metadata: { userId, permissionId },
		});

		return { success: true };
	});
