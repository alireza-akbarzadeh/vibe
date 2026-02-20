import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";

/**
 * Delete a single viewing history entry
 */
export const deleteHistoryItem = authedProcedure
	.input(
		z.object({
			historyId: z.string(),
		}),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({ success: z.boolean(), id: z.string() }),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const item = await prisma.viewingHistory.findUnique({
			where: { id: input.historyId },
			include: { profile: { select: { userId: true } } },
		});

		if (!item) {
			throw errors.NOT_FOUND({ message: "History item not found" });
		}

		if (item.profile.userId !== context.user.id) {
			throw errors.FORBIDDEN({
				message: "You can only delete your own history",
			});
		}

		await prisma.viewingHistory.delete({
			where: { id: input.historyId },
		});

		return {
			status: 200,
			message: "History item deleted",
			data: { success: true, id: input.historyId },
		};
	});

/**
 * Clear all viewing history for a profile
 */
export const clearHistory = authedProcedure
	.input(
		z.object({
			profileId: z.string(),
		}),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({ success: z.boolean(), deletedCount: z.number() }),
		),
	)
	.handler(async ({ input, context, errors }) => {
		const profile = await prisma.profile.findFirst({
			where: { id: input.profileId, userId: context.user.id },
		});

		if (!profile) {
			throw errors.FORBIDDEN({
				message: "Profile does not belong to you",
			});
		}

		const result = await prisma.viewingHistory.deleteMany({
			where: { profileId: input.profileId },
		});

		return {
			status: 200,
			message: "History cleared successfully",
			data: { success: true, deletedCount: result.count },
		};
	});
