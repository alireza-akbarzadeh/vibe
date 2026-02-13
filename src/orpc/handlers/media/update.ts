import { os } from "@orpc/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { withRequire } from "@/orpc/middleware/middleware";
import { createMediaInputSchema } from "../../models/media.input.schema";
import { MediaItemSchema } from "../../models/media.schema";

/* -------------------------------------------------------------------------- */
/*                                CREATE MEDIA                                 */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                UPDATE MEDIA                                 */
/* -------------------------------------------------------------------------- */

export const updateMedia = os
	.use(
		withRequire({
			role: "ADMIN",
			permission: { resource: "media", action: "update" },
		}),
	)
	.input(createMediaInputSchema.extend({ id: z.string() }))
	.output(ApiResponseSchema(MediaItemSchema))
	.handler(async ({ input, context }) => {
		const { id, genreIds, creatorIds, ...mediaData } = input;

		const result = await prisma.$transaction(async (tx) => {
			const existing = await tx.media.findUnique({ where: { id } });

			const media = await tx.media.update({
				where: { id },
				data: {
					...mediaData,
					genres: genreIds
						? {
								deleteMany: {},
								create: genreIds.map((id) => ({
									genre: { connect: { id } },
								})),
							}
						: undefined,
					creators: creatorIds
						? {
								deleteMany: {},
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
					action: "UPDATE",
					resource: "MEDIA",
					resourceId: media.id,
					metadata: {
						before: existing,
						after: mediaData,
					},
				},
			});

			return media;
		});

		return {
			status: 200,
			message: "Media updated successfully",
			data: MediaItemSchema.parse(result),
		};
	});
