import { db } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { profileOutput, updateProfileInput } from "@/orpc/models/profile";

export const updateProfile = authedProcedure
	.input(updateProfileInput)
	.output(ResponseSchema.ApiResponseSchema(profileOutput))
	.handler(async ({ input, context, errors }) => {
		const { id, ...data } = input;

		// Ensure profile belongs to user
		const existing = await db.client.profile.findFirst({
			where: { id, userId: context.user.id },
		});

		if (!existing) {
			throw errors.NOT_FOUND({ message: "Profile not found" });
		}

		const profile = await db.client.profile.update({
			where: { id },
			data,
		});

		return {
			status: 200,
			message: "Profile updated successfully",
			data: {
				id: profile.id,
				userId: profile.userId,
				name: profile.name,
				image: profile.image,
				pin: profile.pin,
				isKids: profile.isKids,
				language: profile.language,
			},
		};
	});
