import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	bulkCreateCastInputSchema,
	createCastMemberInputSchema,
} from "@/orpc/models/cast.input.schema";
import { CastMemberSchema } from "@/orpc/models/cast.schema";

/**
 * Create a single cast member (Admin only)
 */
export const createCastMember = adminProcedure
	.input(createCastMemberInputSchema)
	.output(ApiResponseSchema(CastMemberSchema))
	.handler(async ({ input }) => {
		const { mediaId, personId, castType, role, order, tmdbCreditId } = input;

		// Verify media exists
		const media = await prisma.media.findUnique({ where: { id: mediaId } });
		if (!media) {
			throw { code: "NOT_FOUND", status: 404, message: "Media not found" };
		}

		// Verify person exists
		const person = await prisma.person.findUnique({ where: { id: personId } });
		if (!person) {
			throw { code: "NOT_FOUND", status: 404, message: "Person not found" };
		}

		const castMember = await prisma.mediaCast.create({
			data: {
				mediaId,
				personId,
				castType,
				role: role || null,
				order,
				tmdbCreditId: tmdbCreditId || null,
			},
			include: {
				person: {
					select: {
						id: true,
						tmdbId: true,
						name: true,
						originalName: true,
						profilePath: true,
						knownForDepartment: true,
						popularity: true,
					},
				},
			},
		});

		return {
			status: 201,
			message: "Cast member added successfully",
			data: castMember,
		};
	});

/**
 * Bulk create cast members (Admin only)
 * Used for importing cast from TMDB
 */
export const bulkCreateCast = adminProcedure
	.input(bulkCreateCastInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				created: z.number(),
				skipped: z.number(),
				failed: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { mediaId, cast, skipDuplicates } = input;

		// Verify media exists
		const media = await prisma.media.findUnique({ where: { id: mediaId } });
		if (!media) {
			throw { code: "NOT_FOUND", status: 404, message: "Media not found" };
		}

		let created = 0;
		let skipped = 0;
		let failed = 0;

		for (const member of cast) {
			try {
				// Verify person exists
				const person = await prisma.person.findUnique({
					where: { id: member.personId },
				});
				if (!person) {
					failed++;
					continue;
				}

				// Check for duplicate if needed
				if (skipDuplicates) {
					const existing = await prisma.mediaCast.findFirst({
						where: {
							mediaId,
							personId: member.personId,
							castType: member.castType,
							role: member.role || null,
						},
					});

					if (existing) {
						skipped++;
						continue;
					}
				}

				await prisma.mediaCast.create({
					data: {
						mediaId,
						personId: member.personId,
						castType: member.castType,
						role: member.role || null,
						order: member.order || 0,
						tmdbCreditId: member.tmdbCreditId || null,
					},
				});

				created++;
			} catch {
				failed++;
			}
		}

		return {
			status: 201,
			message: `Bulk create completed: ${created} created, ${skipped} skipped, ${failed} failed`,
			data: {
				created,
				skipped,
				failed,
			},
		};
	});
