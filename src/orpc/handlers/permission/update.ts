import { db } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import {
	permissionOutput,
	updatePermissionInput,
} from "@/orpc/models/permission";
import { auditLog } from "../user/audit";

export const updatePermission = adminProcedure
	.input(updatePermissionInput)
	.output(ResponseSchema.ApiResponseSchema(permissionOutput))
	.handler(async ({ input, context, errors }) => {
		const { id, ...data } = input;

		const existing = await db.client.permission.findUnique({
			where: { id },
		});

		if (!existing) {
			throw errors.NOT_FOUND({ message: "Permission not found" });
		}

		// Check uniqueness if updating resource or action
		if (data.resource || data.action) {
			const resource = data.resource ?? existing.resource;
			const action = data.action ?? existing.action;

			const duplicate = await db.client.permission.findFirst({
				where: {
					id: { not: id },
					resource,
					action,
				},
			});

			if (duplicate) {
				throw errors.CONFLICT({
					message: "Permission already exists for this resource and action",
				});
			}
		}

		const permission = await db.client.permission.update({
			where: { id },
			data,
		});

		await auditLog({
			userId: context.user.id,
			action: "UPDATE_PERMISSION",
			resource: "Permission",
			resourceId: permission.id,
			metadata: data,
		});

		return {
			status: 200,
			message: "Permission updated successfully",
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
