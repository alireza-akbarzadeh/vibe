import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { removeFavoriteInput } from "@/orpc/models/favorite";

export const removeFavorite = authedProcedure
	.input(removeFavoriteInput)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({ success: z.boolean(), mediaId: z.string() }),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const favorite = await prisma.favorite.findUnique({
			where: {
				userId_mediaId: {
					userId: context.user.id,
					mediaId: input.mediaId,
				},
			},
		});

		if (!favorite) {
			throw errors.NOT_FOUND({ message: "Favorite not found" });
		}

		await prisma.favorite.delete({
			where: {
				userId_mediaId: {
					userId: context.user.id,
					mediaId: input.mediaId,
				},
			},
		});

		return {
			status: 200,
			message: "Removed from favorites",
			data: { success: true, mediaId: input.mediaId },
		};
	});
