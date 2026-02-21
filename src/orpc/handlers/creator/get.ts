import { z } from "zod";
import { db } from "@/lib/db.server";
import { publicProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { creatorOutput } from "@/orpc/models/creator";

/**
 * Get all creators with pagination (public)
 */
export const listCreators = publicProcedure
	.input(
		z
			.object({
				limit: z.number().min(1).max(100).default(20),
				cursor: z.string().cuid().optional(),
				search: z.string().optional(),
			})
			.optional(),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			ResponseSchema.PaginatedOutput(creatorOutput),
		),
	)
	.handler(async ({ input = { limit: 20 } }) => {
		const { limit, cursor, search } = input;

		const where = search
			? {
					name: {
						contains: search,
						mode: "insensitive" as const,
					},
				}
			: undefined;

		const creators = await db.client.creator.findMany({
			where,
			orderBy: { name: "asc" },
			take: limit + 1,
			...(cursor && { cursor: { id: cursor } }),
		});

		let nextCursor: string | undefined;
		if (creators.length > limit) {
			const nextItem = creators.pop();
			nextCursor = nextItem?.id;
		}

		return {
			status: 200,
			message: "Creators retrieved successfully",
			data: {
				items: creators.map((c) => ({
					id: c.id,
					name: c.name,
					bio: c.bio,
					image: c.image,
					birthDate: c.birthDate?.toISOString() ?? null,
				})),
				nextCursor,
			},
		};
	});

/**
 * Get a single creator by ID (public)
 */
export const getCreator = publicProcedure
	.input(z.object({ id: z.string() }))
	.output(ResponseSchema.ApiResponseSchema(creatorOutput))
	.handler(async ({ input, errors }) => {
		const creator = await db.client.creator.findUnique({
			where: { id: input.id },
		});

		if (!creator) {
			throw errors.NOT_FOUND({ message: "Creator not found" });
		}

		return {
			status: 200,
			message: "Creator retrieved successfully",
			data: {
				id: creator.id,
				name: creator.name,
				bio: creator.bio,
				image: creator.image,
				birthDate: creator.birthDate?.toISOString() ?? null,
			},
		};
	});
