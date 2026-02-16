import { prisma } from "@/lib/db";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { updateCastMemberInputSchema } from "@/orpc/models/cast.input.schema";
import { CastMemberSchema } from "@/orpc/models/cast.schema";

/**
 * Update a cast member (Admin only)
 */
export const updateCastMember = adminProcedure
	.input(updateCastMemberInputSchema)
	.output(ApiResponseSchema(CastMemberSchema))
	.handler(async ({ input }) => {
		const { id, role, order, castType } = input;

		// Verify cast member exists
		const existingMember = await prisma.mediaCast.findUnique({
			where: { id },
		});

		if (!existingMember) {
			throw {
				code: "NOT_FOUND",
				status: 404,
				message: "Cast member not found",
			};
		}

		const updatedMember = await prisma.mediaCast.update({
			where: { id },
			data: {
				...(role !== undefined && { role }),
				...(order !== undefined && { order }),
				...(castType !== undefined && { castType }),
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
			status: 200,
			message: "Cast member updated successfully",
			data: updatedMember,
		};
	});
