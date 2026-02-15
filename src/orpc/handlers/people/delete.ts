import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";

/**
 * Delete Person Entry
 */
export const deletePeople = adminProcedure
	.input(z.object({ id: z.string() }))
	.output(ApiResponseSchema(z.object({ id: z.string() })))
	.handler(async ({ input }) => {
		await prisma.people.delete({
			where: { id: input.id },
		});

		return {
			status: 200,
			message: "Person deleted successfully",
			data: { id: input.id },
		};
	});

/**
 * Bulk Delete People
 */
export const bulkDeletePeople = adminProcedure
	.input(z.object({ ids: z.array(z.string()).min(1) }))
	.output(ApiResponseSchema(z.object({ deletedCount: z.number() })))
	.handler(async ({ input }) => {
		const result = await prisma.people.deleteMany({
			where: {
				id: { in: input.ids },
			},
		});

		return {
			status: 200,
			message: `${result.count} people deleted successfully`,
			data: { deletedCount: result.count },
		};
	});
