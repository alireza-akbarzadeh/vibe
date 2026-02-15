import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	bulkCreatePeopleInputSchema,
	createPeopleInputSchema,
} from "@/orpc/models/people.input.schema";
import { PeopleSchema } from "@/orpc/models/people.schema";

/**
 * Create Single Person Entry
 */
export const createPeople = adminProcedure
	.input(createPeopleInputSchema)
	.output(ApiResponseSchema(PeopleSchema))
	.handler(async ({ input }) => {
		const person = await prisma.people.create({
			data: input,
		});

		return {
			status: 201,
			message: "Person created successfully",
			data: person,
		};
	});

/**
 * Bulk Create People - Optimized for importing large datasets
 * Supports up to 1000 records at once with automatic duplicate handling
 */
export const bulkCreatePeople = adminProcedure
	.input(bulkCreatePeopleInputSchema)
	.output(
		ApiResponseSchema(
			z.object({
				created: z.number(),
				skipped: z.number(),
				errors: z.array(
					z.object({
						index: z.number(),
						error: z.string(),
						data: z.any(),
					}),
				),
			}),
		),
	)
	.handler(async ({ input }) => {
		const { people, skipDuplicates } = input;

		let created = 0;
		let skipped = 0;
		const errors: Array<{
			index: number;
			error: string;
			data: CreatePeopleInput;
		}> = [];

		// Process in batches of 100 for optimal performance
		const batchSize = 100;
		for (let i = 0; i < people.length; i += batchSize) {
			const batch = people.slice(i, i + batchSize);

			try {
				if (skipDuplicates) {
					// Use createMany with skipDuplicates for better performance
					const result = await prisma.people.createMany({
						data: batch,
						skipDuplicates: true,
					});
					created += result.count;
					// Approximate skipped count
					skipped += batch.length - result.count;
				} else {
					// Process individually to capture errors
					for (let j = 0; j < batch.length; j++) {
						const personData = batch[j];
						try {
							await prisma.people.create({
								data: personData,
							});
							created++;
						} catch (error: unknown) {
							const err = error as { code?: string; message?: string };
							if (err.code === "P2002") {
								// Unique constraint violation
								skipped++;
								errors.push({
									index: i + j,
									error: "Duplicate entry (person_id + movieId exists)",
									data: personData,
								});
							} else {
								errors.push({
									index: i + j,
									error: err.message || "Unknown error",
									data: personData,
								});
							}
						}
					}
				}
			} catch (error: unknown) {
				const err = error as { message?: string };
				// Batch-level error
				errors.push({
					index: i,
					error: `Batch error: ${err.message || "Unknown error"}`,
					data: batch[0] || ({} as CreatePeopleInput),
				});
			}
		}

		return {
			status: 201,
			message: `Bulk create completed: ${created} created, ${skipped} skipped, ${errors.length} errors`,
			data: {
				created,
				skipped,
				errors,
			},
		};
	});
