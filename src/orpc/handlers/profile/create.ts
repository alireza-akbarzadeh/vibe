import { db } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { createProfileInput, profileOutput } from "@/orpc/models/profile";

export const createProfile = authedProcedure
	.input(createProfileInput)
	.output(ResponseSchema.ApiResponseSchema(profileOutput))
	.handler(async ({ input, context }) => {
		const profile = await db.client.profile.create({
			data: {
				...input,
				userId: context.user.id,
			},
		});

		return {
			status: 201,
			message: "Profile created successfully",
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
