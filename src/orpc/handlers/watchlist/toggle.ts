import { z } from "zod";
import { db } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";

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

		const media = await db.client.media.findUnique({
			where: { id: mediaId },
		});

		if (!media) {
			throw errors.NOT_FOUND({ message: "Media not found" });
		}

		const existing = await db.client.watchList.findUnique({
			where: { userId_mediaId: { userId, mediaId } },
		});

		if (existing) {
			await db.client.watchList.delete({
				where: { userId_mediaId: { userId, mediaId } },
			});
			return {
				status: 200,
				message: "Removed from watchlist",
				data: { inWatchlist: false, mediaId },
			};
		}

		await db.client.watchList.create({
			data: { userId, mediaId },
		});

		return {
			status: 201,
			message: "Added to watchlist",
			data: { inWatchlist: true, mediaId },
		};
	});
