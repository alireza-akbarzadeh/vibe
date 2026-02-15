import { prisma } from "@/lib/db";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { updatePeopleInputSchema } from "@/orpc/models/people.input.schema";
import { PeopleSchema } from "@/orpc/models/people.schema";

/**
 * Update Person Entry
 */
export const updatePeople = adminProcedure
	.input(updatePeopleInputSchema)
	.output(ApiResponseSchema(PeopleSchema))
	.handler(async ({ input }) => {
		const { id, ...updateData } = input;

		const person = await prisma.people.update({
			where: { id },
			data: updateData,
		});

		return {
			status: 200,
			message: "Person updated successfully",
			data: person,
		};
	});
