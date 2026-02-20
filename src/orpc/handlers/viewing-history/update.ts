import { prisma } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import {
	updateProgressInput,
	viewingHistoryOutput,
} from "@/orpc/models/viewing-history";

export const updateProgress = authedProcedure
	.input(updateProgressInput)
	.output(ResponseSchema.ApiResponseSchema(viewingHistoryOutput))
	.handler(async ({ input, context, errors }) => {
		const { profileId, mediaId, progress, completed } = input;

		// Verify profile belongs to user
		const profile = await prisma.profile.findFirst({
			where: {
				id: profileId,
				userId: context.user.id,
			},
		});

		if (!profile) {
			throw errors.FORBIDDEN({ message: "Profile does not belong to you" });
		}

		// Verify media exists
		const media = await prisma.media.findUnique({
			where: { id: mediaId },
		});

		if (!media) {
			throw errors.NOT_FOUND({ message: "Media not found" });
		}

		// Upsert viewing history
		const history = await prisma.viewingHistory.upsert({
			where: {
				id: `${profileId}_${mediaId}`,
			},
			update: {
				progress,
				completed,
				viewedAt: new Date(),
			},
			create: {
				profileId,
				mediaId,
				progress,
				completed,
			},
		});

		return {
			status: 200,
			message: "Progress updated successfully",
			data: {
				id: history.id,
				profileId: history.profileId,
				mediaId: history.mediaId,
				progress: history.progress,
				completed: history.completed,
				viewedAt: history.viewedAt.toISOString(),
			},
		};
	});
