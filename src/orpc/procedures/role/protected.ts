// src/orpc/procedures/role.ts
import { os } from "@orpc/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withRequire } from "@/orpc/middleware";
import { ApiResponseSchema } from "@/orpc/schema";
import { auditLog } from "../user/audit";

// ----------------------------
// SCHEMAS
// ----------------------------
const RoleSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
});

const UserRoleSchema = z.object({
	userId: z.string(),
	roleId: z.string(),
	assignedAt: z.string(),
	assignedBy: z.string().nullable(),
});

// ----------------------------
// CREATE ROLE
// ----------------------------
export const createRole = os
	.use(withRequire({ role: "ADMIN" }))
	.input(
		z.object({
			name: z.string(),
			description: z.string().optional(),
		}),
	)
	.output(ApiResponseSchema(RoleSchema))
	.handler(async ({ input, context }) => {
		const role = await prisma.role.create({
			data: input,
		});

		await auditLog({
			userId: context.user.id,
			action: "CREATE_ROLE",
			resource: "Role",
			resourceId: role.id,
			metadata: input,
		});

		return { status: 200, message: "Role created", data: role };
	});

// ----------------------------
// LIST ROLES
// ----------------------------
export const listRoles = os
	.use(withRequire({ role: "ADMIN" }))
	.output(ApiResponseSchema(z.array(RoleSchema)))
	.handler(async () => {
		const roles = await prisma.role.findMany();
		return { status: 200, message: "Roles fetched", data: roles };
	});

// ----------------------------
// UPDATE ROLE
// ----------------------------
export const updateRole = os
	.use(withRequire({ role: "ADMIN" }))
	.input(
		z.object({
			id: z.string(),
			name: z.string().optional(),
			description: z.string().optional(),
		}),
	)
	.output(ApiResponseSchema(RoleSchema))
	.handler(async ({ input, context }) => {
		const role = await prisma.role.update({
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

// ----------------------------
// DELETE ROLE
// ----------------------------
export const deleteRole = os
	.use(withRequire({ role: "ADMIN" }))
	.input(z.object({ id: z.string() }))
	.output(ApiResponseSchema(RoleSchema))
	.handler(async ({ input, context }) => {
		const role = await prisma.role.delete({ where: { id: input.id } });

		await auditLog({
			userId: context.user.id,
			action: "DELETE_ROLE",
			resource: "Role",
			resourceId: role.id,
		});

		return { status: 200, message: "Role deleted", data: role };
	});

// ----------------------------
// ASSIGN ROLE TO USER
// ----------------------------
export const assignRoleToUser = os
	.use(withRequire({ role: "ADMIN" }))
	.input(
		z.object({
			userId: z.string(),
			roleId: z.string(),
		}),
	)
	.output(ApiResponseSchema(UserRoleSchema))
	.handler(async ({ input, context }) => {
		const userRole = await prisma.userRole.create({
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

// ----------------------------
// REMOVE ROLE FROM USER
// ----------------------------
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
