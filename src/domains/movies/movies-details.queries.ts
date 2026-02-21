import { orpc } from "@/lib/orpc";
import { watchListOutput } from "@/orpc/models/watchlist";
import { z } from "zod";

type WatchListItem = z.infer<typeof watchListOutput>;

/**
 * Query options for movie details page
 */

// Fetch main movie data
export const movieDetailsQueryOptions = (mediaId: string) =>
	orpc.media.find.queryOptions({
		queryKey: ["media", "details", mediaId],
		input: { id: mediaId },
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
	orpc.media.list.queryOptions({
		queryKey: ["media", "similar", mediaId, genreIds],
		input: {
			page: 1,
			// Fetch 7 to have a better chance of getting 6 after filtering
			limit: 7,
			type: "MOVIE",
			genreIds: genreIds!,
			status: ["PUBLISHED"],
			sortBy: "NEWEST",
		},
		select: (data) => {
			// Filter out the current movie and limit to 6 results
			const filteredItems = data.items
				.filter((item) => item.id !== mediaId)
				.slice(0, 6);

			return {
				...data,
				items: filteredItems,
			};
		},
		enabled: !!genreIds && genreIds.length > 0,
		staleTime: 15 * 60 * 1000, // 15 minutes
	});

// Fetch watchlist status
export const movieWatchlistStatusQueryOptions = (mediaId: string) =>
	orpc.watchlist.list.queryOptions({
		queryKey: ["watchlist", "status", mediaId],
		input: {
			page: 1,
			limit: 100,
		},
		select: (response) => {
			const inWatchlist = response.data.items.some(
				(item: WatchListItem) => item.mediaId === mediaId,
			);
			return { inWatchlist };
		},
		staleTime: 30 * 1000,
	});
