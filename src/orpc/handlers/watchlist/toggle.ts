import { prisma } from "@/lib/db";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { z } from "zod";

/**
 * Toggle watchlist status for a media item.
 * If already in watchlist → removes it, otherwise → adds it.
 */
export const toggleWatchList = authedProcedure
	.input(z.object({ mediaId: z.string() }))
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({
				inWatchlist: z.boolean(),
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

		const existing = await prisma.watchList.findUnique({
			where: { userId_mediaId: { userId, mediaId } },
		});

		if (existing) {
			await prisma.watchList.delete({
				where: { userId_mediaId: { userId, mediaId } },
			});
			return {
				status: 200,
				message: "Removed from watchlist",
				data: { inWatchlist: false, mediaId },
			};
		}

		await prisma.watchList.create({
			data: { userId, mediaId },
		});

		return {
			status: 201,
			message: "Added to watchlist",
			data: { inWatchlist: true, mediaId },
		};
	});
