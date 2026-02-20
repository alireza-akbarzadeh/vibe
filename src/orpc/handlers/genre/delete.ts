import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { genreIdInput } from "@/orpc/models/genre";
import { auditLog } from "../user/audit";

export const deleteGenre = adminProcedure
	.input(genreIdInput)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({ success: z.boolean(), id: z.string() }),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const existing = await prisma.genre.findUnique({
			where: { id: input.id },
		});

		if (!existing) {
			throw errors.NOT_FOUND({ message: "Genre not found" });
		}

		await prisma.genre.delete({
			where: { id: input.id },
		});

		await auditLog({
			userId: context.user.id,
			action: "DELETE_GENRE",
			resource: "Genre",
			resourceId: input.id,
			metadata: { name: existing.name },
		});

		return {
			status: 200,
			message: "Genre deleted successfully",
			data: { success: true, id: input.id },
		};
	});
