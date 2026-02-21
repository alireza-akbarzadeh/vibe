import { z } from "zod";
import { db } from "@/lib/db.server";
import { roleProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { RoleSchema, UserRoleSchema } from "@/orpc/models/role";
import { auditLog } from "../user/audit";

export const updateRole = roleProcedure
	.input(
		z.object({
			id: z.string(),
			name: z.string().optional(),
			description: z.string().optional(),
		}),
	)
	.output(ApiResponseSchema(RoleSchema))
	.handler(async ({ input, context }) => {
		const role = await db.client.role.update({
			where: { id: input.id },
			data: {
				name: input.name,
				description: input.description,
			},
		});

		await auditLog({
			userId: context.user.id,
			action: "UPDATE_ROLE",
			resource: "Role",
			resourceId: role.id,
			metadata: input,
		});

		return { status: 200, message: "Role updated", data: role };
	});

export const assignRoleToUser = roleProcedure
	.input(
		z.object({
			userId: z.string(),
			roleId: z.string(),
		}),
	)
	.output(ApiResponseSchema(UserRoleSchema))
	.handler(async ({ input, context }) => {
		const userRole = await db.client.userRole.create({
			data: {
				userId: input.userId,
				roleId: input.roleId,
				assignedBy: context.user.id,
			},
		});

		await auditLog({
			userId: context.user.id,
			action: "ASSIGN_ROLE",
			resource: "UserRole",
			resourceId: `${input.userId}-${input.roleId}`,
		});

		return {
			status: 200,
			message: "Role assigned to user",
			data: {
				...userRole,
				assignedAt: userRole.assignedAt.toISOString(),
			},
		};
	});
