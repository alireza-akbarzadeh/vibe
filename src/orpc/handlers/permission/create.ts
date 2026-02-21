import { db } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import {
	createPermissionBulkInput,
	createPermissionInput,
	permissionBulkOutput,
	permissionOutput,
} from "@/orpc/models/permission";
import { auditLog } from "../user/audit";

export const createPermission = adminProcedure
	.input(createPermissionInput)
	.output(ResponseSchema.ApiResponseSchema(permissionOutput))
	.handler(async ({ input, context, errors }) => {
		// Check if permission already exists (unique resource + action)
		const existing = await db.client.permission.findUnique({
			where: {
				resource_action: {
					resource: input.resource,
					action: input.action,
				},
			},
		});

		if (existing) {
			throw errors.CONFLICT({
				message: "Permission already exists for this resource and action",
			});
		}

		const permission = await db.client.permission.create({
			data: input,
		});

		await auditLog({
			userId: context.user.id,
			action: "CREATE_PERMISSION",
			resource: "Permission",
			resourceId: permission.id,
			metadata: input,
		});

		return {
			status: 201,
			message: "Permission created successfully",
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

export const createPermissionBulk = adminProcedure
	.input(createPermissionBulkInput)
	.output(ResponseSchema.ApiResponseSchema(permissionBulkOutput))
	.handler(async ({ input, context }) => {
		const { permissions } = input;

		// 1️⃣ Find existing permissions
		const existing = await db.client.permission.findMany({
			where: {
				OR: permissions.map((p) => ({
					resource: p.resource,
					action: p.action,
				})),
			},
			select: {
				resource: true,
				action: true,
			},
		});

		const existingSet = new Set(
			existing.map((p) => `${p.resource}:${p.action}`),
		);

		// 2️⃣ Split new vs skipped
		const toCreate = permissions.filter(
			(p) => !existingSet.has(`${p.resource}:${p.action}`),
		);

		const skipped = permissions
			.filter((p) => existingSet.has(`${p.resource}:${p.action}`))
			.map((p) => ({
				resource: p.resource,
				action: p.action,
				reason: "ALREADY_EXISTS" as const,
			}));

		// 3️⃣ Create new permissions
		if (toCreate.length > 0) {
			await db.client.permission.createMany({
				data: toCreate,
				skipDuplicates: true, // extra safety
			});
		}

		// 4️⃣ Fetch created permissions (for IDs)
		const created = toCreate.length
			? await db.client.permission.findMany({
					where: {
						OR: toCreate.map((p) => ({
							resource: p.resource,
							action: p.action,
						})),
					},
					select: {
						id: true,
						name: true,
						resource: true,
						action: true,
					},
				})
			: [];

		// 5️⃣ Audit log
		await auditLog({
			userId: context.user.id,
			action: "BULK_CREATE_PERMISSION",
			resource: "Permission",
			metadata: {
				createdCount: created.length,
				skippedCount: skipped.length,
			},
		});

		return {
			status: 201,
			message: "Bulk permission creation completed",
			data: {
				created,
				skipped,
			},
		};
	});
