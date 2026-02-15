import { prisma } from "@/lib/db";
import { adminProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import {
	bulkCreatePersonInputSchema,
	type CreatePersonInput,
	createPersonInputSchema,
} from "@/orpc/models/person.input.schema";
import { PersonWithKnownForSchema } from "@/orpc/models/person.schema";

/**
 * Create a single person with their known_for movies
 */
export const create = adminProcedure
	.input(createPersonInputSchema)
	.output(ApiResponseSchema(PersonWithKnownForSchema))
	.handler(async ({ input }) => {
		const { known_for, ...personData } = input;

		// Create person and their known_for movies in a transaction
		const person = await prisma.person.create({
			data: {
				tmdbId: personData.id,
				adult: personData.adult,
				gender: personData.gender ?? null,
				knownForDepartment: personData.known_for_department ?? null,
				name: personData.name,
				originalName: personData.original_name || personData.name,
				popularity: personData.popularity,
				profilePath: personData.profile_path ?? null,
				knownFor: {
					create: known_for.map((item) => ({
						tmdbId: item.id,
						adult: item.adult,
						backdropPath: item.backdrop_path ?? null,
						title: item.title || item.name || "",
						originalLanguage: item.original_language ?? null,
						originalTitle: (item.original_title || item.original_name) ?? null,
						overview: item.overview ?? null,
						posterPath: item.poster_path ?? null,
						mediaType: item.media_type,
						genreIds: JSON.stringify(item.genre_ids),
						popularity: item.popularity,
						releaseDate: item.release_date
							? new Date(item.release_date)
							: item.first_air_date
								? new Date(item.first_air_date)
								: null,
						video: item.video,
						voteAverage: item.vote_average,
						voteCount: item.vote_count,
					})),
				},
			},
			include: {
				knownFor: true,
			},
		});

		return {
			status: 201,
			message: "Person created successfully",
			data: person,
		};
	});

/**
 * Bulk create persons from TMDB API response
 * Handles up to 1000 persons at once with batch processing
 */
export const bulkCreate = adminProcedure
	.input(bulkCreatePersonInputSchema)
	.output(
		ApiResponseSchema(
			PersonWithKnownForSchema.pick({ id: true, name: true, tmdbId: true }),
		),
	)
	.handler(async ({ input }) => {
		const { persons, skipDuplicates } = input;

		let created = 0;
		let skipped = 0;
		const errors: Array<{
			index: number;
			error: string;
			data: CreatePersonInput;
		}> = [];

		// Process in batches of 100 for performance
		const batchSize = 100;
		for (let i = 0; i < persons.length; i += batchSize) {
			const batch = persons.slice(i, i + batchSize);

			try {
				if (skipDuplicates) {
					// Process each person individually to skip duplicates
					for (let j = 0; j < batch.length; j++) {
						const personData = batch[j];
						try {
							const { known_for, ...data } = personData;

							await prisma.person.create({
								data: {
									tmdbId: data.id,
									adult: data.adult,
									gender: data.gender ?? null,
									knownForDepartment: data.known_for_department ?? null,
									name: data.name,
									originalName: data.original_name || data.name,
									popularity: data.popularity,
									profilePath: data.profile_path ?? null,
									knownFor: {
										create: known_for.map((item) => ({
											tmdbId: item.id,
											adult: item.adult,
											backdropPath: item.backdrop_path ?? null,
											title: item.title || item.name || "",
											originalLanguage: item.original_language ?? null,
											originalTitle:
												(item.original_title || item.original_name) ?? null,
											overview: item.overview ?? null,
											posterPath: item.poster_path ?? null,
											mediaType: item.media_type,
											genreIds: JSON.stringify(item.genre_ids),
											popularity: item.popularity,
											releaseDate: item.release_date
												? new Date(item.release_date)
												: item.first_air_date
													? new Date(item.first_air_date)
													: null,
											video: item.video,
											voteAverage: item.vote_average,
											voteCount: item.vote_count,
										})),
									},
								},
							});
							created++;
						} catch (error: unknown) {
							const err = error as { code?: string; message?: string };
							if (err.code === "P2002") {
								skipped++;
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
					data: batch[0] || ({} as CreatePersonInput),
				});
			}
		}

		return {
			status: created > 0 ? 201 : 200,
			message: `Bulk create completed: ${created} created, ${skipped} skipped, ${errors.length} failed`,
			data: {
				created,
				skipped,
				failed: errors.length,
				errors: errors.slice(0, 10), // Return first 10 errors
			},
		};
	});
