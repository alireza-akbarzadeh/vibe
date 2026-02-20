import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { genreOutput, updateGenreInput } from "@/orpc/models/genre";
import { auditLog } from "../user/audit";

export const updateGenre = adminProcedure
	.input(updateGenreInput)
	.output(ResponseSchema.ApiResponseSchema(genreOutput))
	.handler(async ({ input, context, errors }) => {
		const { id, ...data } = input;

		const existing = await prisma.genre.findUnique({
			where: { id },
		});

		if (!existing) {
			throw errors.NOT_FOUND({ message: "Genre not found" });
		}

		// Check name uniqueness if updating name
		if (data.name && data.name !== existing.name) {
			const duplicate = await prisma.genre.findUnique({
				where: { name: data.name },
			});

			if (duplicate) {
				throw errors.CONFLICT({
					message: "Genre name already exists",
					data: { field: "name" },
				});
			}
		}

		const genre = await prisma.genre.update({
			where: { id },
			data,
		});

		await auditLog({
			userId: context.user.id,
			action: "UPDATE_GENRE",
			resource: "Genre",
			resourceId: genre.id,
			metadata: data,
		});

		return {
			status: 200,
			message: "Genre updated successfully",
			data: {
				id: genre.id,
				name: genre.name,
				description: genre.description,
				type: genre.type,
			},
		};
	});
