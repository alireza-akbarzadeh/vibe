import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { creatorIdInput } from "@/orpc/models/creator";
import { auditLog } from "../user/audit";

export const deleteCreator = adminProcedure
	.input(creatorIdInput)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({ success: z.boolean(), id: z.string() }),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const existing = await prisma.creator.findUnique({
			where: { id: input.id },
		});

		if (!existing) {
			throw errors.NOT_FOUND({ message: "Creator not found" });
		}

		await prisma.creator.delete({
			where: { id: input.id },
		});

		await auditLog({
			userId: context.user.id,
			action: "DELETE_CREATOR",
			resource: "Creator",
			resourceId: input.id,
			metadata: { name: existing.name },
		});

		return {
			status: 200,
			message: "Creator deleted successfully",
			data: { success: true, id: input.id },
		};
	});
