import { z } from "zod";
import { db } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { profileIdInput } from "@/orpc/models/profile";

export const deleteProfile = authedProcedure
	.input(profileIdInput)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({ success: z.boolean(), id: z.string() }),
		),
	)
	.handler(async ({ input, context, errors }) => {
		// Ensure profile belongs to user
		const existing = await db.client.profile.findFirst({
			where: { id: input.id, userId: context.user.id },
		});

		if (!existing) {
			throw errors.NOT_FOUND({ message: "Profile not found" });
		}

		await db.client.profile.delete({
			where: { id: input.id },
		});

		return {
			status: 200,
			message: "Profile deleted successfully",
			data: { success: true, id: input.id },
		};
	});
