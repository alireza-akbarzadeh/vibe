import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";

export const deleteReview = authedProcedure
	.input(z.object({ id: z.string() }))
	.output(ApiResponseSchema(z.object({ success: z.boolean() })))
	.handler(async ({ input, context, errors }) => {
		const { id } = input;
		const userId = context.user.id;

		// Find review
		const review = await prisma.userReview.findUnique({
			where: { id },
		});

		if (!review) {
			throw errors.NOT_FOUND({ message: "Review not found" });
		}

		if (review.userId !== userId) {
			throw errors.FORBIDDEN({
				message: "You can only delete your own reviews",
			});
		}

		const mediaId = review.mediaId;

		// Delete review
		await prisma.userReview.delete({
			where: { id },
		});

		// Recalculate media rating
		const reviews = await prisma.userReview.findMany({
			where: { mediaId },
			select: { rating: true },
		});

		const avgRating =
			reviews.length > 0
				? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
				: 0;

		await prisma.media.update({
			where: { id: mediaId },
			data: {
				rating: avgRating,
				reviewCount: reviews.length,
			},
		});

		return {
			status: 200,
			message: "Review deleted successfully",
			data: { success: true },
		};
	});
