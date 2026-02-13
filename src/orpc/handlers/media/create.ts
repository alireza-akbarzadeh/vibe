import { os } from "@orpc/server";
import { prisma } from "@/lib/db";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { withRequire } from "@/orpc/middleware/middleware";
import { createMediaInputSchema } from "../../models/media.input.schema";
import { MediaItemSchema } from "../../models/media.schema";

export const createMedia = os
	.use(
		withRequire({
			role: "ADMIN",
			permission: { resource: "media", action: "create" },
		}),
	)
	.input(createMediaInputSchema)
	.output(ApiResponseSchema(MediaItemSchema))
	.handler(async ({ input, context }) => {
		const { genreIds, creatorIds, ...mediaData } = input;

		const result = await prisma.$transaction(async (tx) => {
			const media = await tx.media.create({
				data: {
					...mediaData,
					genres: genreIds
						? {
								create: genreIds.map((id) => ({
									genre: { connect: { id } },
								})),
							}
						: undefined,
					creators: creatorIds
						? {
								create: creatorIds.map((id) => ({
									creator: { connect: { id } },
									role: "ARTIST",
								})),
							}
						: undefined,
				},
				include: {
					genres: { include: { genre: true } },
					creators: { include: { creator: true } },
					collection: {
						include: {
							media: {
								select: {
									id: true,
									title: true,
									thumbnail: true,
									type: true,
								},
								orderBy: { sortOrder: "asc" },
							},
						},
					},
				},
			});

			await tx.auditLog.create({
				data: {
					userId: context.user.id,
					action: "CREATE",
					resource: "MEDIA",
					resourceId: media.id,
					metadata: input,
				},
			});

			return media;
		});

		return {
			status: 200,
			message: "Media created successfully",
			data: MediaItemSchema.parse(result),
		};
	});
