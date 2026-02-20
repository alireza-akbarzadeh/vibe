import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { permissionIdInput } from "@/orpc/models/permission";
import { auditLog } from "../user/audit";

export const deletePermission = adminProcedure
	.input(permissionIdInput)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({ success: z.boolean(), id: z.string() }),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const existing = await prisma.permission.findUnique({
			where: { id: input.id },
		});

		if (!existing) {
			throw errors.NOT_FOUND({ message: "Permission not found" });
		}

		await prisma.permission.delete({
			where: { id: input.id },
		});

		await auditLog({
			userId: context.user.id,
			action: "DELETE_PERMISSION",
			resource: "Permission",
			resourceId: input.id,
			metadata: {
				name: existing.name,
				resource: existing.resource,
				action: existing.action,
			},
		});

		return {
			status: 200,
			message: "Permission deleted successfully",
			data: { success: true, id: input.id },
		};
	});
