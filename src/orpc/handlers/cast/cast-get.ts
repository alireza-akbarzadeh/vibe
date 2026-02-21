import type { CastType } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db.server";
import { publicProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	getMediaCastInputSchema,
	listCastInputSchema,
} from "@/orpc/models/cast.input.schema";
import { CastMemberSchema, GroupedCastSchema } from "@/orpc/models/cast.schema";

/**
 * List cast members with pagination (Public)
 */
export const listCast = publicProcedure
	.input(listCastInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				items: z.array(CastMemberSchema),
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
		const { mediaId, personId, castType, limit, page } = input;
		const skip = (page - 1) * limit;

		type WhereClause = {
			mediaId?: string;
			personId?: string;
			castType?: typeof castType;
		};
		const where: WhereClause = {};
		if (mediaId) where.mediaId = mediaId;
		if (personId) where.personId = personId;
		if (castType) where.castType = castType;

		const [castMembers, total] = await Promise.all([
			db.client.mediaCast.findMany({
				where,
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
				orderBy: [{ castType: "asc" }, { order: "asc" }],
				skip,
				take: limit,
			}),
			db.client.mediaCast.count({ where }),
		]);

		return {
			status: 200,
			message: "Cast members retrieved successfully",
			data: {
				items: castMembers,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
		};
	});

/**
 * Get cast for a specific media, grouped by type (Public)
 * This is the main endpoint for movie details pages
 */
export const getMediaCast = publicProcedure
	.input(getMediaCastInputSchema)
	.output(ApiResponseSchema(GroupedCastSchema))
	.handler(async ({ input }) => {
		const {
			mediaId,
			includeActors,
			includeDirectors,
			includeWriters,
			includeProducers,
			includeCrew,
			maxActors,
			maxPerType,
		} = input;

		// Build conditions for what to include
		const types: CastType[] = [];
		if (includeActors) types.push("ACTOR");
		if (includeDirectors) types.push("DIRECTOR");
		if (includeWriters) types.push("WRITER");
		if (includeProducers) types.push("PRODUCER");
		if (includeCrew) {
			types.push("CINEMATOGRAPHER", "COMPOSER", "EDITOR", "OTHER");
		}

		const allCast = await db.client.mediaCast.findMany({
			where: {
				mediaId,
				castType: { in: types },
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
			orderBy: [{ castType: "asc" }, { order: "asc" }],
		});

		// Group by type
		const actors = allCast
			.filter((c) => c.castType === "ACTOR")
			.slice(0, maxActors);

		const directors = allCast
			.filter((c) => c.castType === "DIRECTOR")
			.slice(0, maxPerType);

		const writers = allCast
			.filter((c) => c.castType === "WRITER")
			.slice(0, maxPerType);

		const producers = allCast
			.filter((c) => c.castType === "PRODUCER")
			.slice(0, maxPerType);

		const crew = allCast
			.filter((c) =>
				["CINEMATOGRAPHER", "COMPOSER", "EDITOR", "OTHER"].includes(
					c.castType as CastType,
				),
			)
			.slice(0, maxPerType);

		return {
			status: 200,
			message: "Media cast retrieved successfully",
			data: {
				actors,
				directors,
				writers,
				producers,
				crew,
			},
		};
	});
