import { queryOptions } from "@tanstack/react-query";
import { client } from "@/orpc/client";

/**
 * Query options for movie details page
 */

// Fetch main movie data
export const movieDetailsQueryOptions = (mediaId: string) =>
	queryOptions({
		queryKey: ["media", "details", mediaId],
		queryFn: async () => {
			const response = await client.media.find({ id: mediaId });
			return response.data;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

// Fetch cast and crew
export const movieCastQueryOptions = (mediaId: string) =>
	queryOptions({
		queryKey: ["cast", "media", mediaId],
		queryFn: async () => {
			const response = await client.cast.getMediaCast({
				mediaId,
				includeActors: true,
				includeDirectors: true,
				includeWriters: true,
				includeProducers: true,
				includeCrew: true,
				maxActors: 20,
				maxPerType: 10,
			});
			return response.data;
		},
		staleTime: 10 * 60 * 1000, // 10 minutes
	});

// Fetch videos (trailers, teasers, etc.)
export const movieVideosQueryOptions = (mediaId: string) =>
	queryOptions({
		queryKey: ["videos", "media", mediaId],
		queryFn: async () => {
			const response = await client.mediaAsset.getMediaVideos({ mediaId });
			return response.data;
		},
		staleTime: 10 * 60 * 1000,
	});

// Fetch images (backdrops, posters, etc.)
export const movieImagesQueryOptions = (mediaId: string) =>
	queryOptions({
		queryKey: ["images", "media", mediaId],
		queryFn: async () => {
			const response = await client.mediaAsset.getMediaImages({ mediaId });
			return response.data;
		},
		staleTime: 10 * 60 * 1000,
	});

// Fetch reviews
export const movieReviewsQueryOptions = (mediaId: string, page = 1) =>
	queryOptions({
		queryKey: ["reviews", "media", mediaId, page],
		queryFn: async () => {
			const response = await client.reviews.list({
				mediaId,
				page,
				limit: 10,
				sortBy: "recent",
			});
			return response.data;
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
				return { items: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 0 } };
			}

			const response = await client.media.list({
				page: 1,
				limit: 6,
				type: "MOVIE",
				genreIds,
				status: ["PUBLISHED"],
				sortBy: "NEWEST",
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
export const movieWatchlistStatusQueryOptions = (
	mediaId: string,
	profileId?: string,
) =>
	queryOptions({
		queryKey: ["watchlist", "status", mediaId, profileId],
		queryFn: async () => {
			if (!profileId) return { inWatchlist: false };

			const response = await client.watchlist.list({
				profileId,
				page: 1,
				limit: 100,
			});

			const inWatchlist = response.data.items.some(
				(item) => item.mediaId === mediaId,
			);
			return { inWatchlist };
		},
		enabled: !!profileId,
		staleTime: 30 * 1000, // 30 seconds
	});
