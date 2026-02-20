import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { bulkDeleteInputSchema } from "@/orpc/models/person.input.schema";

/**
 * Delete a single person by ID
 * Cascade deletes their known_for movies
 */
export const remove = adminProcedure
	.input(z.object({ id: z.string() }))
	.output(ApiResponseSchema(z.object({ id: z.string() })))
	.handler(async ({ input }) => {
		await prisma.person.delete({
			where: { id: input.id },
		});

		return {
			status: 200,
			message: "Person deleted successfully",
			data: { id: input.id },
		};
	});

/**
 * Bulk delete persons by IDs
 */
export const bulkDelete = adminProcedure
	.input(bulkDeleteInputSchema)
	.output(ApiResponseSchema(z.object({ count: z.number() })))
	.handler(async ({ input }) => {
		const result = await prisma.person.deleteMany({
			where: {
				id: { in: input.ids },
			},
		});

		return {
			status: 200,
			message: `${result.count} persons deleted successfully`,
			data: { count: result.count },
		};
	});
