import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                              INPUT SCHEMAS                                 */
/* -------------------------------------------------------------------------- */

export const createPermissionInput = z.object({
	name: z.string().min(1).max(255),
	description: z.string().optional(),
	resource: z.string().min(1),
	action: z.string().min(1),
});

export const updatePermissionInput = z.object({
	id: z.string(),
	name: z.string().min(1).max(255).optional(),
	description: z.string().optional().nullable(),
	resource: z.string().min(1).optional(),
	action: z.string().min(1).optional(),
});

export const permissionIdInput = z.object({
	id: z.string(),
});
export const permissionBulkOutput = z.object({
	created: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			resource: z.string(),
			action: z.string(),
		}),
	),
	skipped: z.array(
		z.object({
			resource: z.string(),
			action: z.string(),
			reason: z.literal("ALREADY_EXISTS"),
		}),
	),
});
export const createPermissionBulkInput = z.object({
	permissions: z.array(createPermissionInput).min(1),
});

/* -------------------------------------------------------------------------- */
/*                              OUTPUT SCHEMAS                                */
/* -------------------------------------------------------------------------- */

export const permissionOutput = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	resource: z.string(),
	action: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const permissionListOutput = z.array(permissionOutput);
