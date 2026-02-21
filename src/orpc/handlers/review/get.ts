import { z } from "zod";
import { db } from "@/lib/db.server";
import { authedProcedure, publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	listReviewsInputSchema,
	markHelpfulInputSchema,
	reviewOutputSchema,
	reviewWithUserSchema,
} from "@/orpc/models/review";

export const listReviews = publicProcedure
	.input(listReviewsInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(reviewWithUserSchema),
				pagination: z.object({
					page: z.number(),
					limit: z.number(),
					total: z.number(),
					totalPages: z.number(),
				}),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { mediaId, page, limit, sortBy } = input;
		const skip = (page - 1) * limit;

		// Build orderBy
		type OrderByType =
			| { createdAt: "desc" }
			| { rating: "desc" }
			| { rating: "asc" }
			| { helpful: "desc" };

		let orderBy: OrderByType = { createdAt: "desc" };
		if (sortBy === "highest") orderBy = { rating: "desc" };
		if (sortBy === "lowest") orderBy = { rating: "asc" };
		if (sortBy === "helpful") orderBy = { helpful: "desc" };

		const [reviews, total] = await Promise.all([
			prisma.userReview.findMany({
				where: { mediaId },
				include: {
					user: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
				},
				orderBy,
				skip,
				take: limit,
			}),
			prisma.userReview.count({
				where: { mediaId },
			}),
		]);

		return {
			status: 200,
			message: "Reviews retrieved successfully",
			data: {
				items: reviews,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
		};
	});

export const getUserReview = authedProcedure
	.input(z.object({ mediaId: z.string() }))
	.output(ApiResponseSchema(reviewOutputSchema.nullable()))
	.handler(async ({ input, context }) => {
		const review = await prisma.userReview.findUnique({
			where: {
				userId_mediaId: {
					userId: context.user.id,
					mediaId: input.mediaId,
				},
			},
		});

		return {
			status: 200,
			message: review ? "Review found" : "No review found",
			data: review,
		};
	});

export const markHelpful = authedProcedure
	.input(markHelpfulInputSchema)
	.output(ApiResponseSchema(z.object({ helpful: z.number() })))
	.handler(async ({ input, errors }) => {
		const { reviewId } = input;

		const review = await prisma.userReview.findUnique({
			where: { id: reviewId },
		});

		if (!review) {
			throw errors.NOT_FOUND({ message: "Review not found" });
		}

		const updated = await prisma.userReview.update({
			where: { id: reviewId },
			data: { helpful: { increment: 1 } },
			select: { helpful: true },
		});

		return {
			status: 200,
			message: "Review marked as helpful",
			data: { helpful: updated.helpful },
		};
	});
