import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/orpc/client";

// ─── Library Dashboard ──────────────────────────────────────────────────────

export function useLibraryDashboard() {
	return useQuery({
		queryKey: ["library", "dashboard"],
		queryFn: () => client.library.dashboard(),
		staleTime: 2 * 60 * 1000,
	});
}

// ─── Favorites ──────────────────────────────────────────────────────────────

export function useFavorites(options?: { page?: number; limit?: number }) {
	return useQuery({
		queryKey: ["library", "favorites", options],
		queryFn: () =>
			client.favorites.list({
				page: options?.page ?? 1,
				limit: options?.limit ?? 20,
			}),
		staleTime: 60 * 1000,
	});
}

export function useCheckFavorite(mediaId: string | undefined) {
	return useQuery({
		queryKey: ["library", "favorites", "check", mediaId],
		queryFn: () => client.favorites.check({ mediaId: mediaId! }),
		enabled: !!mediaId,
		staleTime: 60 * 1000,
	});
}

export function useToggleFavorite() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (mediaId: string) => client.favorites.toggle({ mediaId }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["library", "favorites"] });
			queryClient.invalidateQueries({ queryKey: ["library", "dashboard"] });
			toast.success(
				data.data.isFavorite ? "Added to favorites" : "Removed from favorites",
			);
		},
		onError: (error: Error) => {
			toast.error("Failed to update favorites", {
				description: error.message,
			});
		},
	});
}

// ─── Watchlist ──────────────────────────────────────────────────────────────

export function useWatchList(options?: { page?: number; limit?: number }) {
	return useQuery({
		queryKey: ["library", "watchlist", options],
		queryFn: () =>
			client.watchlist.list({
				page: options?.page ?? 1,
				limit: options?.limit ?? 20,
			}),
		staleTime: 60 * 1000,
	});
}

export function useCheckWatchList(mediaId: string | undefined) {
	return useQuery({
		queryKey: ["library", "watchlist", "check", mediaId],
		queryFn: () => client.watchlist.check({ mediaId: mediaId! }),
		enabled: !!mediaId,
		staleTime: 60 * 1000,
	});
}

export function useToggleWatchList() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (mediaId: string) => client.watchlist.toggle({ mediaId }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["library", "watchlist"] });
			queryClient.invalidateQueries({ queryKey: ["library", "dashboard"] });
			toast.success(
				data.data.inWatchlist ? "Added to watchlist" : "Removed from watchlist",
			);
		},
		onError: (error: Error) => {
			toast.error("Failed to update watchlist", {
				description: error.message,
			});
		},
	});
}

// ─── Viewing History ────────────────────────────────────────────────────────

export function useViewingHistory(
	profileId: string | undefined,
	options?: { page?: number; limit?: number },
) {
	return useQuery({
		queryKey: ["library", "history", profileId, options],
		queryFn: () =>
			client.viewingHistory.get({
				profileId: profileId!,
				page: options?.page ?? 1,
				limit: options?.limit ?? 20,
			}),
		enabled: !!profileId,
		staleTime: 60 * 1000,
	});
}

export function useContinueWatching(
	profileId: string | undefined,
	limit?: number,
) {
	return useQuery({
		queryKey: ["library", "continueWatching", profileId, limit],
		queryFn: () =>
			client.viewingHistory.continueWatching({
				profileId: profileId!,
				limit: limit ?? 10,
			}),
		enabled: !!profileId,
		staleTime: 60 * 1000,
	});
}

export function useDeleteHistoryItem() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (historyId: string) =>
			client.viewingHistory.deleteItem({ historyId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library", "history"] });
			queryClient.invalidateQueries({ queryKey: ["library", "dashboard"] });
			toast.success("History item removed");
		},
		onError: (error: Error) => {
			toast.error("Failed to remove history item", {
				description: error.message,
			});
		},
	});
}

export function useClearHistory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (profileId: string) =>
			client.viewingHistory.clear({ profileId }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["library", "history"] });
			queryClient.invalidateQueries({
				queryKey: ["library", "continueWatching"],
			});
			queryClient.invalidateQueries({ queryKey: ["library", "dashboard"] });
			toast.success(`Cleared ${data.data.deletedCount} items from history`);
		},
		onError: (error: Error) => {
			toast.error("Failed to clear history", {
				description: error.message,
			});
		},
	});
}

export function useUpdateProgress() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (params: {
			profileId: string;
			mediaId: string;
			progress: number;
			completed?: boolean;
		}) => client.viewingHistory.update(params),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library", "history"] });
			queryClient.invalidateQueries({
				queryKey: ["library", "continueWatching"],
			});
		},
	});
}

// ─── Profiles ───────────────────────────────────────────────────────────────

export function useProfiles() {
	return useQuery({
		queryKey: ["library", "profiles"],
		queryFn: () => client.profiles.list(),
		staleTime: 5 * 60 * 1000,
	});
}

export function useProfile(profileId: string | undefined) {
	return useQuery({
		queryKey: ["library", "profiles", profileId],
		queryFn: () => client.profiles.get({ id: profileId! }),
		enabled: !!profileId,
		staleTime: 5 * 60 * 1000,
	});
}

export function useCreateProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (params: {
			name: string;
			image?: string;
			pin?: string;
			isKids?: boolean;
			language?: string;
		}) => client.profiles.create(params),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library", "profiles"] });
			toast.success("Profile created");
		},
		onError: (error: Error) => {
			toast.error("Failed to create profile", {
				description: error.message,
			});
		},
	});
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (params: {
			id: string;
			name?: string;
			image?: string | null;
			pin?: string | null;
			isKids?: boolean;
			language?: string;
		}) => client.profiles.update(params),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["library", "profiles", variables.id],
			});
			queryClient.invalidateQueries({ queryKey: ["library", "profiles"] });
			toast.success("Profile updated");
		},
		onError: (error: Error) => {
			toast.error("Failed to update profile", {
				description: error.message,
			});
		},
	});
}

export function useDeleteProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (profileId: string) =>
			client.profiles.delete({ id: profileId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["library", "profiles"] });
			toast.success("Profile deleted");
		},
		onError: (error: Error) => {
			toast.error("Failed to delete profile", {
				description: error.message,
			});
		},
	});
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export function useUserReview(mediaId: string | undefined) {
	return useQuery({
		queryKey: ["library", "reviews", "user", mediaId],
		queryFn: () => client.reviews.getUserReview({ mediaId: mediaId! }),
		enabled: !!mediaId,
		staleTime: 2 * 60 * 1000,
	});
}

export function useMediaReviews(
	mediaId: string | undefined,
	options?: { page?: number; limit?: number; sortBy?: string },
) {
	return useQuery({
		queryKey: ["library", "reviews", mediaId, options],
		queryFn: () =>
			client.reviews.list({
				mediaId: mediaId!,
				page: options?.page ?? 1,
				limit: options?.limit ?? 10,
				sortBy:
					(options?.sortBy as "latest" | "highest" | "lowest" | "helpful") ??
					"latest",
			}),
		enabled: !!mediaId,
		staleTime: 60 * 1000,
	});
}

export function useCreateReview() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (params: {
			mediaId: string;
			rating: number;
			review?: string;
		}) => client.reviews.create(params),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["library", "reviews", variables.mediaId],
			});
			queryClient.invalidateQueries({
				queryKey: ["library", "reviews", "user", variables.mediaId],
			});
			queryClient.invalidateQueries({ queryKey: ["library", "dashboard"] });
			toast.success("Review submitted");
		},
		onError: (error: Error) => {
			toast.error("Failed to submit review", {
				description: error.message,
			});
		},
	});
}

// ─── Content ────────────────────────────────────────────────────────────────

export function useLatestReleases(options?: {
	type?: "MOVIE" | "EPISODE" | "TRACK";
	limit?: number;
	page?: number;
}) {
	return useQuery({
		queryKey: ["library", "content", "latest", options],
		queryFn: () =>
			client.content.latestReleases({
				type: options?.type,
				limit: options?.limit ?? 20,
				page: options?.page ?? 1,
			}),
		staleTime: 5 * 60 * 1000,
	});
}

export function usePopularSeries(limit?: number) {
	return useQuery({
		queryKey: ["library", "content", "popularSeries", limit],
		queryFn: () =>
			client.content.popularSeries({ limit: limit ?? 10, page: 1 }),
		staleTime: 5 * 60 * 1000,
	});
}

export function useTopRated(options?: {
	type?: "MOVIE" | "EPISODE" | "TRACK";
	limit?: number;
	page?: number;
}) {
	return useQuery({
		queryKey: ["library", "content", "topRated", options],
		queryFn: () =>
			client.content.topIMDB({
				type: options?.type,
				limit: options?.limit ?? 20,
				page: options?.page ?? 1,
			}),
		staleTime: 5 * 60 * 1000,
	});
}

// ─── Search ─────────────────────────────────────────────────────────────────

export function useSearchContent(options: {
	query: string;
	type?: "MOVIE" | "EPISODE" | "TRACK";
	limit?: number;
	page?: number;
}) {
	return useQuery({
		queryKey: ["library", "content", "search", options],
		queryFn: () =>
			client.content.search({
				query: options.query,
				type: options.type,
				limit: options.limit ?? 20,
				page: options.page ?? 1,
			}),
		enabled: options.query.length > 0,
		staleTime: 30 * 1000,
	});
}
