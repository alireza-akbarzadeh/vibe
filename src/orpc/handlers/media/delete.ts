import { Prisma } from "@prisma/client";
import { z } from "zod";
import { authedProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";

export const deleteMedia = authedProcedure
	.input(z.object({ id: z.string() }))
	.output(
		ApiResponseSchema(
			z.object({
				id: z.string(),
			}),
		),
	)
	.handler(async ({ input, context }) => {
		const result = await context.db.transaction(async (tx) => {
			const existing = await tx.media.findUnique({
				where: { id: input.id },
			});

			const media = await tx.media.delete({
				where: { id: input.id },
			});

			await tx.auditLog.create({
				data: {
					userId: context.user.id,
					action: "DELETE",
					resource: "MEDIA",
					resourceId: media.id,
					metadata: existing || Prisma.DbNull,
				},
			});

			return media;
		});

		return {
			status: 200,
			message: "Media deleted successfully",
			data: { id: result.id },
		};
	});
