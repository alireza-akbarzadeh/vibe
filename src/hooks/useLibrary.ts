import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/orpc/client";

// ─── Library Dashboard ──────────────────────────────────────────────────────

export function useLibraryDashboard() {
	return useQuery(
		orpc.library.dashboard.queryOptions({
			staleTime: 2 * 60 * 1000,
		}),
	);
}

// ─── Favorites ──────────────────────────────────────────────────────────────

export function useFavorites(options?: { page?: number; limit?: number }) {
	return useQuery(
		orpc.favorites.list.queryOptions({
			input: {
				page: options?.page ?? 1,
				limit: options?.limit ?? 20,
			},
			staleTime: 60 * 1000,
		}),
	);
}

export function useCheckFavorite(mediaId: string | undefined) {
	return useQuery({
		...orpc.favorites.check.queryOptions({ input: { mediaId: mediaId! } }),
		enabled: !!mediaId,
		staleTime: 60 * 1000,
	});
}

export function useToggleFavorite() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.favorites.toggle.mutationOptions({
			onSuccess: (data) => {
				queryClient.invalidateQueries({ queryKey: ["library", "favorites"] });
				queryClient.invalidateQueries({ queryKey: ["library", "dashboard"] });
				toast.success(
					data.data.isFavorite
						? "Added to favorites"
						: "Removed from favorites",
				);
			},
			onError: (error: Error) => {
				toast.error("Failed to update favorites", {
					description: error.message,
				});
			},
		}),
	);
}

// ─── Watchlist ──────────────────────────────────────────────────────────────

export function useWatchList(options?: { page?: number; limit?: number }) {
	return useQuery(
		orpc.watchlist.list.queryOptions({
			input: {
				page: options?.page ?? 1,
				limit: options?.limit ?? 20,
			},
			staleTime: 60 * 1000,
		}),
	);
}

export function useCheckWatchList(mediaId: string | undefined) {
	return useQuery({
		...orpc.watchlist.check.queryOptions({ input: { mediaId: mediaId! } }),
		enabled: !!mediaId,
		staleTime: 60 * 1000,
	});
}

export function useToggleWatchList() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.watchlist.toggle.mutationOptions({
			onSuccess: (data) => {
				queryClient.invalidateQueries({ queryKey: ["library", "watchlist"] });
				queryClient.invalidateQueries({ queryKey: ["library", "dashboard"] });
				toast.success(
					data.data.inWatchlist
						? "Added to watchlist"
						: "Removed from watchlist",
				);
			},
			onError: (error: Error) => {
				toast.error("Failed to update watchlist", {
					description: error.message,
				});
			},
		}),
	);
}

// ─── Viewing History ────────────────────────────────────────────────────────

export function useViewingHistory(
	profileId: string | undefined,
	options?: { page?: number; limit?: number },
) {
	return useQuery(
		orpc.viewingHistory.get.queryOptions({
			input: {
				profileId: profileId!,
				page: options?.page ?? 1,
				limit: options?.limit ?? 20,
			},
			staleTime: 60 * 1000,
			enabled: !!profileId,
		}),
	);
}

export function useContinueWatching(
	profileId: string | undefined,
	limit?: number,
) {
	return useQuery(
		orpc.viewingHistory.continueWatching.queryOptions({
			input: {
				profileId: profileId!,
				limit: limit ?? 10,
			},
			staleTime: 60 * 1000,
			enabled: !!profileId,
		}),
	);
}

export function useDeleteHistoryItem() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.viewingHistory.deleteItem.mutationOptions({
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
		}),
	);
}

export function useClearHistory() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.viewingHistory.clear.mutationOptions({
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
		}),
	);
}

export function useUpdateProgress() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.viewingHistory.updateProgress.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["library", "history"] });
				queryClient.invalidateQueries({
					queryKey: ["library", "continueWatching"],
				});
			},
		}),
	);
}

// ─── Profiles ───────────────────────────────────────────────────────────────

export function useProfiles() {
	return useQuery(
		orpc.profiles.list.queryOptions({
			staleTime: 5 * 60 * 1000,
		}),
	);
}

export function useProfile(profileId: string | undefined) {
	return useQuery({
		...orpc.profiles.get.queryOptions({ input: { id: profileId! } }),
		enabled: !!profileId,
		staleTime: 5 * 60 * 1000,
	});
}

export function useCreateProfile() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.profiles.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["library", "profiles"] });
				toast.success("Profile created");
			},
			onError: (error: Error) => {
				toast.error("Failed to create profile", {
					description: error.message,
				});
			},
		}),
	);
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.profiles.update.mutationOptions({
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: ["library", "profiles", variables.input.id],
				});
				queryClient.invalidateQueries({ queryKey: ["library", "profiles"] });
				toast.success("Profile updated");
			},
			onError: (error: Error) => {
				toast.error("Failed to update profile", {
					description: error.message,
				});
			},
		}),
	);
}

export function useDeleteProfile() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.profiles.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["library", "profiles"] });
				toast.success("Profile deleted");
			},
			onError: (error: Error) => {
				toast.error("Failed to delete profile", {
					description: error.message,
				});
			},
		}),
	);
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export function useUserReview(mediaId: string | undefined) {
	return useQuery({
		...orpc.reviews.getUserReview.queryOptions({
			input: { mediaId: mediaId! },
		}),
		enabled: !!mediaId,
		staleTime: 2 * 60 * 1000,
	});
}

export function useMediaReviews(
	mediaId: string | undefined,
	options?: { page?: number; limit?: number; sortBy?: string },
) {
	return useQuery(
		orpc.reviews.list.queryOptions({
			input: {
				mediaId: mediaId!,
				page: options?.page ?? 1,
				limit: options?.limit ?? 10,
				sortBy:
					(options?.sortBy as "latest" | "highest" | "lowest" | "helpful") ??
					"latest",
			},
			staleTime: 60 * 1000,
			enabled: !!mediaId,
		}),
	);
}

export function useCreateReview() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.reviews.create.mutationOptions({
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries({
					queryKey: ["library", "reviews", variables.input.mediaId],
				});
				queryClient.invalidateQueries({
					queryKey: ["library", "reviews", "user", variables.input.mediaId],
				});
				queryClient.invalidateQueries({ queryKey: ["library", "dashboard"] });
				toast.success("Review submitted");
			},
			onError: (error: Error) => {
				toast.error("Failed to submit review", {
					description: error.message,
				});
			},
		}),
	);
}

// ─── Content ────────────────────────────────────────────────────────────────

export function useLatestReleases(options?: {
	type?: "MOVIE" | "EPISODE" | "TRACK";
	limit?: number;
	page?: number;
}) {
	return useQuery(
		orpc.content.latestReleases.queryOptions({
			input: {
				type: options?.type,
				limit: options?.limit ?? 20,
				page: options?.page ?? 1,
			},
			staleTime: 5 * 60 * 1000,
		}),
	);
}

export function usePopularSeries(limit?: number) {
	return useQuery(
		orpc.content.popularSeries.queryOptions({
			input: {
				limit: limit ?? 10,
				page: 1,
			},
			staleTime: 5 * 60 * 1000,
		}),
	);
}

export function useTopRated(options?: {
	type?: "MOVIE" | "EPISODE" | "TRACK";
	limit?: number;
	page?: number;
}) {
	return useQuery(
		orpc.content.topIMDB.queryOptions({
			input: {
				type: options?.type,
				limit: options?.limit ?? 20,
				page: options?.page ?? 1,
			},
			staleTime: 5 * 60 * 1000,
		}),
	);
}

// ─── Search ─────────────────────────────────────────────────────────────────

export function useSearchContent(options: {
	query: string;
	type?: "MOVIE" | "EPISODE" | "TRACK";
	limit?: number;
	page?: number;
}) {
	return useQuery(
		orpc.content.search.queryOptions({
			input: {
				query: options.query,
				type: options.type,
				limit: options.limit ?? 20,
				page: options.page ?? 1,
			},
			staleTime: 30 * 1000,
			enabled: options.query.length > 0,
		}),
	);
}
