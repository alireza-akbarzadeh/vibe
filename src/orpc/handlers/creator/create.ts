import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { createCreatorInput, creatorOutput } from "@/orpc/models/creator";
import { auditLog } from "../user/audit";

export const createCreator = adminProcedure
	.input(createCreatorInput)
	.output(ResponseSchema.ApiResponseSchema(creatorOutput))
	.handler(async ({ input, context }) => {
		const { birthDate, ...rest } = input;

		const creator = await prisma.creator.create({
			data: {
				...rest,
				birthDate: birthDate ? new Date(birthDate) : null,
			},
		});

		await auditLog({
			userId: context.user.id,
			action: "CREATE_CREATOR",
			resource: "Creator",
			resourceId: creator.id,
			metadata: input,
		});

		return {
			status: 201,
			message: "Creator created successfully",
			data: {
				id: creator.id,
				name: creator.name,
				bio: creator.bio,
				image: creator.image,
				birthDate: creator.birthDate?.toISOString() ?? null,
			},
		};
	});

// Bulk create creators
const bulkCreateCreatorInput = z.array(createCreatorInput);

export const bulkCreateCreator = adminProcedure
	.input(bulkCreateCreatorInput)
	.output(ResponseSchema.ApiResponseSchema(z.array(creatorOutput)))
	.handler(async ({ input, context, errors }) => {
		if (!input.length) {
			throw errors.BAD_REQUEST({
				message: "No creators provided",
			});
		}

		// Normalize names to avoid case-based duplicates
		const normalizedInput = input.map((c) => ({
			...c,
			name: c.name.trim(),
		}));

		// Get existing creators by name
		const existingCreators = await prisma.creator.findMany({
			where: {
				name: {
					in: normalizedInput.map((c) => c.name),
				},
			},
			select: {
				name: true,
			},
		});

		const existingSet = new Set(existingCreators.map((c) => c.name));

		const newCreators = normalizedInput.filter((c) => !existingSet.has(c.name));

		if (!newCreators.length) {
			throw errors.CONFLICT({
				message: "All provided creators already exist",
			});
		}

		// Transform birthDate strings to Date objects
		const creatorsToCreate = newCreators.map((c) => ({
			name: c.name,
			bio: c.bio,
			image: c.image,
			birthDate: c.birthDate ? new Date(c.birthDate) : null,
		}));

		// Create in bulk
		await prisma.creator.createMany({
			data: creatorsToCreate,
			skipDuplicates: true,
		});

		// Fetch created creators to return full objects
		const createdCreators = await prisma.creator.findMany({
			where: {
				name: {
					in: newCreators.map((c) => c.name),
				},
			},
			orderBy: { name: "asc" },
		});

		// Audit log (single aggregated log for performance)
		await auditLog({
			userId: context.user.id,
			action: "BULK_CREATE_CREATOR",
			resource: "Creator",
			resourceId: undefined,
			metadata: {
				count: createdCreators.length,
				creators: createdCreators.map((c) => ({
					id: c.id,
					name: c.name,
				})),
			},
		});

		return {
			status: 201,
			message: `${createdCreators.length} creators created successfully`,
			data: createdCreators.map((c) => ({
				id: c.id,
				name: c.name,
				bio: c.bio,
				image: c.image,
				birthDate: c.birthDate?.toISOString() ?? null,
			})),
		};
	});
