import { z } from "zod";
import { db } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	deleteAllCastInputSchema,
	deleteCastMemberInputSchema,
} from "@/orpc/models/cast.input.schema";

/**
 * Delete a single cast member (Admin only)
 */
export const deleteCastMember = adminProcedure
	.input(deleteCastMemberInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				deleted: z.boolean(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { id } = input;

		const castMember = await db.client.mediaCast.findUnique({
			where: { id },
		});

		if (!castMember) {
			throw {
				code: "NOT_FOUND",
				status: 404,
				message: "Cast member not found",
			};
		}

		await db.client.mediaCast.delete({
			where: { id },
		});

		return {
			status: 200,
			message: "Cast member deleted successfully",
			data: { deleted: true },
		};
	});

/**
 * Delete all cast members for a media (Admin only)
 */
export const deleteAllCast = adminProcedure
	.input(deleteAllCastInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				deleted: z.number(),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { mediaId } = input;

		const result = await db.client.mediaCast.deleteMany({
			where: { mediaId },
		});

		return {
			status: 200,
			message: `Deleted ${result.count} cast members`,
			data: { deleted: result.count },
		};
	});
