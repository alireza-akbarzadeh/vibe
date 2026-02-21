import { db } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { updatePersonInputSchema } from "@/orpc/models/person.input.schema";
import { PersonWithKnownForSchema } from "@/orpc/models/person.schema";

/**
 * Update a person's information
 * Note: This only updates the person data, not their known_for movies
 */
export const update = adminProcedure
	.input(updatePersonInputSchema)
	.output(ApiResponseSchema(PersonWithKnownForSchema))
	.handler(async ({ input }) => {
		const { id, ...data } = input;

		const person = await db.client.person.update({
			where: { id },
			data,
			include: {
				knownFor: true,
			},
		});

		return {
			status: 200,
			message: "Person updated successfully",
			data: person,
		};
	});
