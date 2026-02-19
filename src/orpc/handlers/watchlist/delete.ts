import { z } from "zod";
import { prisma } from "@/lib/db";
import { subscribedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { removeFromWatchListInput } from "@/orpc/models/watchlist";

export const removeFromWatchList = subscribedProcedure
	.input(removeFromWatchListInput)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({ success: z.boolean(), mediaId: z.string() }),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const watchListItem = await prisma.watchList.findUnique({
			where: {
				userId_mediaId: {
					userId: context.user.id,
					mediaId: input.mediaId,
				},
			},
		});

		if (!watchListItem) {
			throw errors.NOT_FOUND({ message: "Item not found in watch list" });
		}

		await prisma.watchList.delete({
			where: {
				userId_mediaId: {
					userId: context.user.id,
					mediaId: input.mediaId,
				},
			},
		});

		return {
			status: 200,
			message: "Removed from watch list",
			data: { success: true, mediaId: input.mediaId },
		};
	});
