import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { creatorOutput, updateCreatorInput } from "@/orpc/models/creator";
import { auditLog } from "../user/audit";

export const updateCreator = adminProcedure
	.input(updateCreatorInput)
	.output(ResponseSchema.ApiResponseSchema(creatorOutput))
	.handler(async ({ input, context, errors }) => {
		const { id, birthDate, ...rest } = input;

		const existing = await prisma.creator.findUnique({
			where: { id },
		});

		if (!existing) {
			throw errors.NOT_FOUND({ message: "Creator not found" });
		}

		const creator = await prisma.creator.update({
			where: { id },
			data: {
				...rest,
				...(birthDate !== undefined && {
					birthDate: birthDate ? new Date(birthDate) : null,
				}),
			},
		});

		await auditLog({
			userId: context.user.id,
			action: "UPDATE_CREATOR",
			resource: "Creator",
			resourceId: creator.id,
			metadata: input,
		});

		return {
			status: 200,
			message: "Creator updated successfully",
			data: {
				id: creator.id,
				name: creator.name,
				bio: creator.bio,
				image: creator.image,
				birthDate: creator.birthDate?.toISOString() ?? null,
			},
		};
	});
