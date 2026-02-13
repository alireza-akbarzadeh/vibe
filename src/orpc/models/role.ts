import { z } from "zod";

export const RoleSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
});

export const UserRoleSchema = z.object({
	userId: z.string(),
	roleId: z.string(),
	assignedAt: z.string(),
	assignedBy: z.string().nullable(),
});
