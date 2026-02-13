import { os } from "@orpc/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { withRequire } from "@/orpc/middleware/middleware";

export const deleteMedia = os
	.use(
		withRequire({
			role: "ADMIN",
			permission: { resource: "media", action: "delete" },
		}),
	)
	.input(z.object({ id: z.string() }))
	.output(
		ApiResponseSchema(
			z.object({
				id: z.string(),
			}),
		),
	)
	.handler(async ({ input, context }) => {
		const result = await prisma.$transaction(async (tx) => {
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
