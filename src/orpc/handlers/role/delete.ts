import { os } from "@orpc/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { withRequire } from "@/orpc/middleware/middleware";
import { UserRoleSchema } from "@/orpc/models/role";
import { auditLog } from "../user/audit";

export const removeRoleFromUser = os
	.use(withRequire({ role: "ADMIN" }))
	.input(
		z.object({
			userId: z.string(),
			roleId: z.string(),
		}),
	)
	.output(ApiResponseSchema(UserRoleSchema))
	.handler(async ({ input, context }) => {
		const userRole = await prisma.userRole.delete({
			where: { userId_roleId: { userId: input.userId, roleId: input.roleId } },
		});

		await auditLog({
			userId: context.user.id,
			action: "REMOVE_ROLE",
			resource: "UserRole",
			resourceId: `${input.userId}-${input.roleId}`,
		});

		return {
			status: 200,
			message: "Role removed from user",
			data: {
				...userRole,
				assignedAt: userRole.assignedAt.toISOString(),
			},
		};
	});

export const removeRole = os
	.use(withRequire({ role: "ADMIN" }))
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.output(ApiResponseSchema(z.object({ id: z.string() })))
	.handler(async ({ input }) => {
		const role = await prisma.role.delete({
			where: { id: input.id },
		});

		return {
			status: 200,
			message: "Role deleted",
			data: {
				id: role.id,
			},
		};
	});
