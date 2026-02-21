import { z } from "zod";
import { db } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { createMediaInputSchema } from "@/orpc/models/media.input.schema";
import { auditLog } from "../user/audit";

const mediaOutputSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	thumbnail: z.string(),
	videoUrl: z.string().nullable(),
	audioUrl: z.string().nullable(),
	duration: z.number(),
	releaseYear: z.number(),
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
	collectionId: z.string().nullable(),
	sortOrder: z.number().nullable(),
	status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "REJECTED"]),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const createMedia = adminProcedure
	.input(createMediaInputSchema)
	.output(ResponseSchema.ApiResponseSchema(mediaOutputSchema))
	.handler(async ({ input, context }) => {
		const { genreIds, creatorIds, ...mediaData } = input;

		// Create media with transaction to ensure atomicity
		const media = await prisma.$transaction(async (tx) => {
			const newMedia = await tx.media.create({
				data: mediaData,
			});

			// Connect genres if provided
			if (genreIds && genreIds.length > 0) {
				await tx.mediaGenre.createMany({
					data: genreIds.map((genreId) => ({
						mediaId: newMedia.id,
						genreId,
					})),
				});
			}

			// Connect creators if provided
			if (creatorIds && creatorIds.length > 0) {
				await tx.mediaCreator.createMany({
					data: creatorIds.map((creatorId) => ({
						mediaId: newMedia.id,
						creatorId,
						role: "DIRECTOR", // Default role, can be enhanced
					})),
				});
			}

			return newMedia;
		});

		await auditLog({
			userId: context.user.id,
			action: "CREATE_MEDIA",
			resource: "Media",
			resourceId: media.id,
			metadata: { title: media.title, type: media.type },
		});

		return {
			status: 201,
			message: "Media created successfully",
			data: {
				id: media.id,
				title: media.title,
				description: media.description,
				thumbnail: media.thumbnail,
				videoUrl: media.videoUrl,
				audioUrl: media.audioUrl,
				duration: media.duration,
				releaseYear: media.releaseYear,
				type: media.type,
				collectionId: media.collectionId,
				sortOrder: media.sortOrder,
				status: media.status,
				createdAt: media.createdAt.toISOString(),
				updatedAt: media.updatedAt.toISOString(),
			},
		};
	});

// Bulk create media
const bulkCreateMediaInput = z.array(createMediaInputSchema);

export const bulkCreateMedia = adminProcedure
	.input(bulkCreateMediaInput)
	.output(ResponseSchema.ApiResponseSchema(z.array(mediaOutputSchema)))
	.handler(async ({ input, context, errors }) => {
		if (!input.length) {
			throw errors.BAD_REQUEST({
				message: "No media items provided",
			});
		}

		// Normalize titles
		const normalizedInput = input.map((m) => ({
			...m,
			title: m.title.trim(),
		}));

		// Check for existing media by title
		const existingMedia = await db.client.media.findMany({
			where: {
				title: {
					in: normalizedInput.map((m) => m.title),
				},
			},
			select: {
				title: true,
			},
		});

		const existingSet = new Set(existingMedia.map((m) => m.title));

		const newMediaItems = normalizedInput.filter(
			(m) => !existingSet.has(m.title),
		);

		if (!newMediaItems.length) {
			throw errors.CONFLICT({
				message: "All provided media items already exist",
			});
		}

		// Create media items in transaction
		const createdMedia = await prisma.$transaction(async (tx) => {
			const mediaList = [];

			for (const item of newMediaItems) {
				const { genreIds, creatorIds, ...mediaData } = item;

				// Create media
				const newMedia = await tx.media.create({
					data: mediaData,
				});

				// Connect genres
				if (genreIds && genreIds.length > 0) {
					await tx.mediaGenre.createMany({
						data: genreIds.map((genreId) => ({
							mediaId: newMedia.id,
							genreId,
						})),
					});
				}

				// Connect creators
				if (creatorIds && creatorIds.length > 0) {
					await tx.mediaCreator.createMany({
						data: creatorIds.map((creatorId) => ({
							mediaId: newMedia.id,
							creatorId,
							role: "DIRECTOR",
						})),
					});
				}

				mediaList.push(newMedia);
			}

			return mediaList;
		});

		// Audit log (aggregated)
		await auditLog({
			userId: context.user.id,
			action: "BULK_CREATE_MEDIA",
			resource: "Media",
			resourceId: undefined,
			metadata: {
				count: createdMedia.length,
				media: createdMedia.map((m) => ({
					id: m.id,
					title: m.title,
					type: m.type,
				})),
			},
		});

		return {
			status: 201,
			message: `${createdMedia.length} media items created successfully`,
			data: createdMedia.map((m) => ({
				id: m.id,
				title: m.title,
				description: m.description,
				thumbnail: m.thumbnail,
				videoUrl: m.videoUrl,
				audioUrl: m.audioUrl,
				duration: m.duration,
				releaseYear: m.releaseYear,
				type: m.type,
				collectionId: m.collectionId,
				sortOrder: m.sortOrder,
				status: m.status,
				createdAt: m.createdAt.toISOString(),
				updatedAt: m.updatedAt.toISOString(),
			})),
		};
	});
