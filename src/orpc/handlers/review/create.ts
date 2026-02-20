import { prisma } from "@/lib/db.server";
import { authedProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	createReviewInputSchema,
	reviewOutputSchema,
} from "@/orpc/models/review";

export const createReview = authedProcedure
	.input(createReviewInputSchema)
	.output(ApiResponseSchema(reviewOutputSchema))
	.handler(async ({ input, context, errors }) => {
		const { mediaId, rating, review } = input;
		const userId = context.user.id;

		// Check if media exists
		const media = await prisma.media.findUnique({
			where: { id: mediaId },
		});

		if (!media) {
			throw errors.NOT_FOUND({ message: "Media not found" });
		}

		// Check if user already reviewed
		const existingReview = await prisma.userReview.findUnique({
			where: {
				userId_mediaId: {
					userId,
					mediaId,
				},
			},
		});

		if (existingReview) {
			throw errors.CONFLICT({
				message: "You have already reviewed this media. Use update instead.",
			});
		}

		// Create review
		const newReview = await prisma.userReview.create({
			data: {
				userId,
				mediaId,
				rating,
				review: review || null,
			},
		});

		// Update media stats
		const reviews = await prisma.userReview.findMany({
			where: { mediaId },
			select: { rating: true },
		});

		const avgRating =
			reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

		await prisma.media.update({
			where: { id: mediaId },
			data: {
				rating: avgRating,
				reviewCount: reviews.length,
			},
		});

		return {
			status: 201,
			message: "Review created successfully",
			data: newReview,
		};
	});
