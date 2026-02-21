// hooks/use-watchlist.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/orpc/client";

// Query key factory
export const watchlistKeys = {
	all: ["watchlist"] as const,
	lists: () => [...watchlistKeys.all, "list"] as const,
	list: (filters: { page?: number; limit?: number }) =>
		[...watchlistKeys.lists(), filters] as const,
	details: () => [...watchlistKeys.all, "detail"] as const,
	detail: (mediaId: string) => [...watchlistKeys.details(), mediaId] as const,
};

// Helper to extract error message from ORPC error
const getErrorMessage = (error: unknown): string => {
	if (error && typeof error === "object") {
		// Check for ORPC error format
		if ("message" in error && typeof error.message === "string") {
			return error.message;
		}
		// Check for standard Error
		if (error instanceof Error) {
			return error.message;
		}
	}
	return "An unexpected error occurred";
};

export function useWatchlist() {
	const queryClient = useQueryClient();

	// Get watchlist items with pagination
	const useWatchlistItems = (page = 1, limit = 20) => {
		return useQuery(
			orpc.watchlist.list.queryOptions({
				input: { page, limit },
				queryKey: watchlistKeys.list({ page, limit }),
			}),
		);
	};

	// Check if a specific media item is in watchlist
	const useIsInWatchlist = (mediaId: string) => {
		return useQuery(
			orpc.watchlist.check.queryOptions({
				input: { mediaId },
				queryKey: watchlistKeys.detail(mediaId),
				enabled: !!mediaId,
				staleTime: 1000 * 60 * 5, // 5 minutes
				select: (data) => data.data.inWatchlist,
			}),
		);
	};

	// Add to watchlist mutation
	const useAddToWatchlist = () => {
		return useMutation(
			orpc.watchlist.add.mutationOptions({
				onSuccess: (response, mediaId) => {
					// Show success toast with the message from API
					toast.success(response.message || "Added to watchlist", {
						description: "Item has been added to your watchlist",
					});

					// Invalidate queries
					queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
					queryClient.invalidateQueries({
						queryKey: watchlistKeys.detail(mediaId),
					});
				},
				onError: (error) => {
					const message = getErrorMessage(error);

					// Handle specific error cases with custom toasts
					if (
						message.includes("subscription") ||
						message.toLowerCase().includes("premium")
					) {
						toast.error("Premium Required", {
							description: message,
							action: {
								label: "Upgrade",
								onClick: () => {
									window.location.href = "/pricing";
								},
							},
						});
					} else if (message.includes("already in watch list")) {
						toast.info("Already in Watchlist", {
							description: message,
						});
					} else if (message.includes("Authentication")) {
						toast.error("Sign In Required", {
							description: message,
							action: {
								label: "Sign In",
								onClick: () => {
									window.location.href = "/sign-in";
								},
							},
						});
					} else {
						toast.error("Failed to add", {
							description: message,
						});
					}
				},
			}),
		);
	};

	// Remove from watchlist mutation
	const useRemoveFromWatchlist = () => {
		return useMutation({
			mutationFn: async (mediaId: string) => {
				const response = await client.watchlist.remove({ mediaId });

				if (response.status !== 200) {
					throw new Error(
						response.message || "Failed to remove from watchlist",
					);
				}

				return response;
			},
			onSuccess: (response, mediaId) => {
				// Show success toast with the message from API
				toast.success(response.message || "Removed from watchlist", {
					description: "Item has been removed from your watchlist",
				});

				// Invalidate queries
				queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
				queryClient.invalidateQueries({
					queryKey: watchlistKeys.detail(mediaId),
				});
			},
			onError: (error: unknown) => {
				const message = getErrorMessage(error);

				if (message.includes("not found")) {
					toast.error("Not in Watchlist", {
						description: message,
					});
				} else {
					toast.error("Failed to remove", {
						description: message,
					});
				}
			},
		});
	};

	return {
		useWatchlistItems,
		useIsInWatchlist,
		useAddToWatchlist,
		useRemoveFromWatchlist,
	};
}
