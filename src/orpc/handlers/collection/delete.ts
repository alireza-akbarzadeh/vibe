// src/orpc/procedures/collection.ts
import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { collectionDeleteProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";

export const deleteCollection = collectionDeleteProcedure
	.input(z.object({ id: z.string() }))
	.output(ApiResponseSchema(z.object({ id: z.string() })))
	.handler(async ({ input }) => {
		const collection = await prisma.collection.delete({
			where: { id: input.id },
		});

		return {
			status: 200,
			message: "Collection deleted successfully",
			data: { id: collection.id },
		};
	});
