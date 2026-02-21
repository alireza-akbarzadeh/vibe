import { db } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { addFavoriteInput, favoriteOutput } from "@/orpc/models/favorite";

export const addFavorite = authedProcedure
	.input(addFavoriteInput)
	.output(ResponseSchema.ApiResponseSchema(favoriteOutput))
	.handler(async ({ input, context, errors }) => {
		// Check if media exists
		const media = await db.client.media.findUnique({
			where: { id: input.mediaId },
		});

		if (!media) {
			throw errors.NOT_FOUND({ message: "Media not found" });
		}

		// Check if already favorited
		const existing = await db.client.favorite.findUnique({
			where: {
				userId_mediaId: {
					userId: context.user.id,
					mediaId: input.mediaId,
				},
			},
		});

		if (existing) {
			throw errors.CONFLICT({ message: "Media already in favorites" });
		}

		const favorite = await db.client.favorite.create({
			data: {
				userId: context.user.id,
				mediaId: input.mediaId,
			},
		});

		return {
			status: 201,
			message: "Added to favorites",
			data: {
				id: favorite.id,
				userId: favorite.userId,
				mediaId: favorite.mediaId,
				createdAt: favorite.createdAt.toISOString(),
			},
		};
	});
