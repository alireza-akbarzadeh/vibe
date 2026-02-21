import { z } from "zod";
import { db } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { profileListOutput, profileOutput } from "@/orpc/models/profile";

/**
 * Get all profiles for the authenticated user
 */
export const listProfiles = authedProcedure
	.input(z.void())
	.output(ResponseSchema.ApiResponseSchema(profileListOutput))
	.handler(async ({ context }) => {
		const profiles = await db.client.profile.findMany({
			where: { userId: context.user.id },
			orderBy: { name: "asc" },
		});

		return {
			status: 200,
			message: "Profiles retrieved successfully",
			data: profiles.map((p) => ({
				id: p.id,
				userId: p.userId,
				name: p.name,
				image: p.image,
				pin: p.pin,
				isKids: p.isKids,
				language: p.language,
			})),
		};
	});

/**
 * Get a single profile by ID (must belong to user)
 */
export const getProfile = authedProcedure
	.input(z.object({ id: z.string() }))
	.output(ResponseSchema.ApiResponseSchema(profileOutput))
	.handler(async ({ input, context, errors }) => {
		const profile = await db.client.profile.findFirst({
			where: {
				id: input.id,
				userId: context.user.id,
			},
		});

		if (!profile) {
			throw errors.NOT_FOUND({ message: "Profile not found" });
		}

		return {
			status: 200,
			message: "Profile retrieved successfully",
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
