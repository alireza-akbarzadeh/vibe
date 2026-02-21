import { z } from "zod";
import { db } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	bulkCreatePeopleInputSchema,
	type CreatePeopleInput,
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
		const { knownFor, ...personData } = input;

		const person = await db.client.person.create({
			data: {
				...personData,
				originalName: personData.originalName || "",
				knownFor:
					knownFor && knownFor.length > 0
						? {
								create: knownFor.map((media) => ({
									tmdbId: media.tmdbId,
									mediaType: media.mediaType,
									title: media.title || "",
									genreIds: JSON.stringify(media.genreIds || []),
								})),
							}
						: undefined,
			},
			include: {
				knownFor: true,
			},
		});

		return {
			status: 201,
			message: "Person created successfully",
			data: person as unknown as z.infer<typeof PeopleSchema>,
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
					const batchWithoutRelations = batch.map(({ knownFor, ...p }) => ({
						...p,
						originalName: p.originalName || "",
					}));

					const result = await db.client.person.createMany({
						data: batchWithoutRelations,
						skipDuplicates: true,
					});
					created += result.count;

					skipped += batch.length - result.count;
				} else {
					for (let j = 0; j < batch.length; j++) {
						const { knownFor, ...personData } = batch[j];
						try {
							await db.client.person.create({
								data: {
									...personData,
									originalName: personData.originalName || "",
									knownFor:
										knownFor && knownFor.length > 0
											? {
													create: knownFor.map((media) => ({
														tmdbId: media.tmdbId,
														mediaType: media.mediaType,
														title: media.title || "",
														genreIds: JSON.stringify(media.genreIds || []),
													})),
												}
											: undefined,
								},
							});
							created++;
						} catch (error: unknown) {
							const err = error as { code?: string; message?: string };
							if (err.code === "P2002") {
								// Unique constraint violation
								skipped++;
								errors.push({
									index: i + j,
									error: "Duplicate entry (tmdbId exists)",
									data: batch[j],
								});
							} else {
								errors.push({
									index: i + j,
									error: err.message || "Unknown error",
									data: batch[j],
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
