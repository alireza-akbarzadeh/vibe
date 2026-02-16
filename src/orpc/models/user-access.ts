import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                              INPUT SCHEMAS                                 */
/* -------------------------------------------------------------------------- */

export const assignUserPermissionInput = z.object({
	userId: z.string(),
	permissionId: z.string(),
	expiresAt: z.string().datetime().optional(),
});

export const removeUserPermissionInput = z.object({
	userId: z.string(),
	permissionId: z.string(),
});

export const listUsersWithAccessInput = z.object({
	search: z.string().optional(),
	roleId: z.string().optional(),
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(10),
});

export const userIdInput = z.object({
	userId: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                              OUTPUT SCHEMAS                                */
/* -------------------------------------------------------------------------- */

export const PermissionOutput = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	resource: z.string(),
	action: z.string(),
	isDirect: z.boolean(),
	expiresAt: z.string().nullable(),
	grantedBy: z.string().nullable(),
});

export const RoleOutput = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	assignedAt: z.string(),
	assignedBy: z.string().nullable(),
});

export const UserAccessOutput = z.object({
	id: z.string(),
	name: z.string().nullable(),
	email: z.string(),
	image: z.string().nullable(),
	roles: z.array(RoleOutput),
	permissions: z.array(PermissionOutput),
	createdAt: z.string(),
	updatedAt: z.string(),
	banned: z.boolean(),
});

export const ListUsersWithAccessOutput = z.object({
	users: z.array(UserAccessOutput),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	totalPages: z.number(),
});
