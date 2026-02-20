import { prisma } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	reviewOutputSchema,
	updateReviewInputSchema,
} from "@/orpc/models/review";

export const updateReview = authedProcedure
	.input(updateReviewInputSchema)
	.output(ApiResponseSchema(reviewOutputSchema))
	.handler(async ({ input, context, errors }) => {
		const { id, rating, review } = input;
		const userId = context.user.id;

		// Find review
		const existingReview = await prisma.userReview.findUnique({
			where: { id },
		});

		if (!existingReview) {
			throw errors.NOT_FOUND({ message: "Review not found" });
		}

		if (existingReview.userId !== userId) {
			throw errors.FORBIDDEN({
				message: "You can only update your own reviews",
			});
		}

		// Update review
		const updatedReview = await prisma.userReview.update({
			where: { id },
			data: {
				...(rating !== undefined && { rating }),
				...(review !== undefined && { review }),
			},
		});

		// Recalculate media rating if rating was changed
		if (rating !== undefined) {
			const reviews = await prisma.userReview.findMany({
				where: { mediaId: existingReview.mediaId },
				select: { rating: true },
			});

			const avgRating =
				reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

			await prisma.media.update({
				where: { id: existingReview.mediaId },
				data: { rating: avgRating },
			});
		}

		return {
			status: 200,
			message: "Review updated successfully",
			data: updatedReview,
		};
	});
