import { queryOptions } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";

/**
 * Query options for movie details page
 */

// Fetch main movie data
export const movieDetailsQueryOptions = (mediaId: string) =>
	queryOptions({
		queryKey: ["media", "details", mediaId],
		queryFn: async () => {
			try {
				const response = await orpc.media.find.queryOptions({
					input: { id: mediaId },
				});
				return response.data;
			} catch (error: any) {
				if (error?.status === 404) {
					throw new Error("Movie not found");
				}

				if (error?.code === "SUBSCRIPTION_REQUIRED") {
					throw new Error(
						"A subscription is required to view this content. Please upgrade your plan.",
					);
				}

				const message = error?.message || "Failed to load movie details";
				throw new Error(message);
			}
		},
		staleTime: 5 * 60 * 1000,
		retry: (failureCount, error: unknown) => {
			if (
				typeof error === "object" &&
				error !== null &&
				"code" in error &&
				error.code === "SUBSCRIPTION_REQUIRED"
			) {
				return false;
			}
			return failureCount < 2;
		},
	});

// Fetch cast and crew
export const movieCastQueryOptions = (mediaId: string) =>
	orpc.cast.getMediaCast.queryOptions({
		input: {
			mediaId,
			includeActors: true,
			includeDirectors: true,
			includeWriters: true,
			includeProducers: true,
			includeCrew: true,
			maxActors: 20,
			maxPerType: 10,
		},
		staleTime: 10 * 60 * 1000,
	});

// Fetch videos (trailers, teasers, etc.)
export const movieVideosQueryOptions = (mediaId: string) =>
	orpc.mediaAsset.getMediaVideos.queryOptions({
		input: { mediaId },
		staleTime: 10 * 60 * 1000,
	});

// Fetch images (backdrops, posters, etc.)
export const movieImagesQueryOptions = (mediaId: string) =>
	orpc.mediaAsset.getMediaImages.queryOptions({
		input: { mediaId },
		staleTime: 10 * 60 * 1000,
	});

// Fetch reviews
export const movieReviewsQueryOptions = (mediaId: string, page = 1) =>
	orpc.reviews.list.queryOptions({
		input: {
			mediaId,
			page,
			limit: 10,
			sortBy: "recent",
		},
		staleTime: 2 * 60 * 1000, // 2 minutes
	});

// Fetch similar movies based on genres
export const movieSimilarQueryOptions = (
	mediaId: string,
	genreIds?: string[],
) =>
	queryOptions({
		queryKey: ["media", "similar", mediaId, genreIds],
		queryFn: async () => {
			if (!genreIds || genreIds.length === 0) {
				return {
					items: [],
					pagination: { page: 1, limit: 6, total: 0, totalPages: 0 },
				};
			}

			const response = await orpc.media.list.queryOptions({
				input: {
					page: 1,
					limit: 6,
					type: "MOVIE",
					genreIds,
					status: ["PUBLISHED"],
					sortBy: "NEWEST",
				},
			});

			// Filter out the current movie from results
			const filteredItems = response.data.items.filter(
				(item) => item.id !== mediaId,
			);

			return {
				...response.data,
				items: filteredItems,
			};
		},
		enabled: !!genreIds && genreIds.length > 0,
		staleTime: 15 * 60 * 1000, // 15 minutes
	});

// Fetch watchlist status
export const movieWatchlistStatusQueryOptions = (mediaId: string) =>
	queryOptions({
		queryKey: ["watchlist", "status", mediaId],
		queryFn: async () => {
			try {
				const response = await orpc.watchlist.list.queryOptions({
					input: {
						page: 1,
						limit: 100,
					},
				});

				const inWatchlist = response.data.items.some(
					(item) => item.mediaId === mediaId,
				);
				return { inWatchlist };
			} catch (_error) {
				return { inWatchlist: false };
			}
		},
		staleTime: 30 * 1000,
	});
