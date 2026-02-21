import { z } from "zod";
import { db } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import {
	permissionListOutput,
	permissionOutput,
} from "@/orpc/models/permission";

/**
 * Get all permissions (admin only)
 */
export const listPermissions = adminProcedure
	.input(
		z
			.object({
				resource: z.string().optional(),
				action: z.string().optional(),
			})
			.optional(),
	)
	.output(ResponseSchema.ApiResponseSchema(permissionListOutput))
	.handler(async ({ input = {} }) => {
		const { resource, action } = input;

		const permissions = await db.client.permission.findMany({
			where: {
				...(resource && { resource }),
				...(action && { action }),
			},
			orderBy: [{ resource: "asc" }, { action: "asc" }],
		});

		return {
			status: 200,
			message: "Permissions retrieved successfully",
			data: permissions.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				resource: p.resource,
				action: p.action,
				createdAt: p.createdAt.toISOString(),
				updatedAt: p.updatedAt.toISOString(),
			})),
		};
	});

/**
 * Get a single permission by ID (admin only)
 */
export const getPermission = adminProcedure
	.input(z.object({ id: z.string() }))
	.output(ResponseSchema.ApiResponseSchema(permissionOutput))
	.handler(async ({ input, errors }) => {
		const permission = await db.client.permission.findUnique({
			where: { id: input.id },
		});

		if (!permission) {
			throw errors.NOT_FOUND({ message: "Permission not found" });
		}

		return {
			status: 200,
			message: "Permission retrieved successfully",
			data: {
				id: permission.id,
				name: permission.name,
				description: permission.description,
				resource: permission.resource,
				action: permission.action,
				createdAt: permission.createdAt.toISOString(),
				updatedAt: permission.updatedAt.toISOString(),
			},
		};
	});
