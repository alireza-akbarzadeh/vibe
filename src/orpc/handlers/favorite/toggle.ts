import { prisma } from "@/lib/db";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { z } from "zod";

/**
 * Toggle favorite status for a media item.
 * If already favorited → removes it, otherwise → adds it.
 */
export const toggleFavorite = authedProcedure
	.input(z.object({ mediaId: z.string() }))
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({
				isFavorite: z.boolean(),
				mediaId: z.string(),
			}),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const { mediaId } = input;
		const userId = context.user.id;

		const media = await prisma.media.findUnique({
			where: { id: mediaId },
		});

		if (!media) {
			throw errors.NOT_FOUND({ message: "Media not found" });
		}

		const existing = await prisma.favorite.findUnique({
			where: { userId_mediaId: { userId, mediaId } },
		});

		if (existing) {
			await prisma.favorite.delete({
				where: { userId_mediaId: { userId, mediaId } },
			});
			return {
				status: 200,
				message: "Removed from favorites",
				data: { isFavorite: false, mediaId },
			};
		}

		await prisma.favorite.create({
			data: { userId, mediaId },
		});

		return {
			status: 201,
			message: "Added to favorites",
			data: { isFavorite: true, mediaId },
		};
	});
