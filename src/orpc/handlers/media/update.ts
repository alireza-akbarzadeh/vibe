import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { authedProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { createMediaInputSchema } from "@/orpc/models/media.input.schema";
import { MediaItemSchema } from "@/orpc/models/media.schema";

/* -------------------------------------------------------------------------- */
/*                                CREATE MEDIA                                 */
/* -------------------------------------------------------------------------- */

export const createMedia = authedProcedure
	.input(createMediaInputSchema)
	.output(ApiResponseSchema(MediaItemSchema))
	.handler(async ({ input, context }) => {
		const { genreIds, creatorIds, ...mediaData } = input;

		const result = await context.db.transaction(
			async (tx: Prisma.TransactionClient) => {
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
			},
		);

		return {
			status: 200,
			message: "Media created successfully",
			data: MediaItemSchema.parse(result),
		};
	});

/* -------------------------------------------------------------------------- */
/*                                UPDATE MEDIA                                 */
/* -------------------------------------------------------------------------- */

export const updateMedia = authedProcedure
	.input(createMediaInputSchema.extend({ id: z.string() }))
	.output(ApiResponseSchema(MediaItemSchema))
	.handler(async ({ input, context }) => {
		const { id, genreIds, creatorIds, ...mediaData } = input;

		const result = await context.db.transaction(
			async (tx: Prisma.TransactionClient) => {
				const media = await tx.media.update({
					where: { id },
					data: {
						...mediaData,
						genres: {
							deleteMany: {},
							create: genreIds?.map((id) => ({
								genre: { connect: { id } },
							})),
						},
						creators: {
							deleteMany: {},
							create: creatorIds?.map((id) => ({
								creator: { connect: { id } },
								role: "ARTIST",
							})),
						},
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
						action: "UPDATE",
						resource: "MEDIA",
						resourceId: media.id,
						metadata: input,
					},
				});

				return media;
			},
		);

		return {
			status: 200,
			message: "Media updated successfully",
			data: MediaItemSchema.parse(result),
		};
	});
