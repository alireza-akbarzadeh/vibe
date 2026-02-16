// hooks/use-favorites.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/orpc/client";

// Query key factory
export const favoritesKeys = {
	all: ["favorites"] as const,
	lists: () => [...favoritesKeys.all, "list"] as const,
	list: (filters: { page?: number; limit?: number }) =>
		[...favoritesKeys.lists(), filters] as const,
	details: () => [...favoritesKeys.all, "detail"] as const,
	detail: (mediaId: string) => [...favoritesKeys.details(), mediaId] as const,
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

export function useFavorites() {
	const queryClient = useQueryClient();

	// Get favorite items with pagination
	const useFavoriteItems = (page = 1, limit = 20) => {
		return useQuery({
			queryKey: favoritesKeys.list({ page, limit }),
			queryFn: async () => {
				const response = await client.favorites.list({
					page,
					limit,
				});

				if (response.status !== 200) {
					throw new Error(response.message || "Failed to fetch favorites");
				}

				return response.data;
			},
		});
	};

	// Check if a specific media item is in favorites
	const useIsFavorite = (mediaId: string) => {
		return useQuery({
			queryKey: favoritesKeys.detail(mediaId),
			queryFn: async () => {
				try {
					const response = await client.favorites.check({ mediaId });

					if (response.status !== 200) {
						return false;
					}

					return response.data.isFavorite;
				} catch {
					return false;
				}
			},
			enabled: !!mediaId,
			staleTime: 1000 * 60 * 5, // 5 minutes
		});
	};

	// Toggle favorite with optimistic update
	const useToggleFavorite = () => {
		return useMutation({
			mutationFn: async ({
				mediaId,
				isFavorite,
			}: {
				mediaId: string;
				isFavorite: boolean;
			}) => {
				if (isFavorite) {
					// Remove from favorites
					const response = await client.favorites.remove({ mediaId });

					if (response.status !== 200) {
						throw new Error(
							response.message || "Failed to remove from favorites",
						);
					}

					return { ...response, action: "removed" as const };
				}

				// Add to favorites
				const response = await client.favorites.add({ mediaId });

				if (response.status !== 201) {
					throw new Error(response.message || "Failed to add to favorites");
				}

				return { ...response, action: "added" as const };
			},
			// Optimistic update
			onMutate: async ({ mediaId, isFavorite }) => {
				// Cancel any outgoing refetches
				await queryClient.cancelQueries({
					queryKey: favoritesKeys.detail(mediaId),
				});

				// Snapshot the previous value
				const previousIsFavorite = queryClient.getQueryData<boolean>(
					favoritesKeys.detail(mediaId),
				);

				// Optimistically update to the new value
				queryClient.setQueryData(favoritesKeys.detail(mediaId), !isFavorite);

				// Return context with the previous value
				return { previousIsFavorite, mediaId };
			},
			onSuccess: (response, { mediaId }) => {
				// Show success toast
				toast.success(
					response.message ||
						(response.action === "added"
							? "Added to favorites"
							: "Removed from favorites"),
					{
						description:
							response.action === "added"
								? "Item has been added to your favorites"
								: "Item has been removed from your favorites",
					},
				);

				// Invalidate and refetch
				queryClient.invalidateQueries({ queryKey: favoritesKeys.lists() });
				queryClient.invalidateQueries({
					queryKey: favoritesKeys.detail(mediaId),
				});
			},
			onError: (error: unknown, { mediaId }, context) => {
				// Rollback on error
				if (context?.previousIsFavorite !== undefined) {
					queryClient.setQueryData(
						favoritesKeys.detail(mediaId),
						context.previousIsFavorite,
					);
				}

				const message = getErrorMessage(error);

				// Handle specific error cases
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
				} else if (message.includes("already in favorites")) {
					toast.info("Already in Favorites", {
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
					toast.error("Failed to update favorites", {
						description: message,
					});
				}
			},
			// Ensure we always refetch after mutation settles
			onSettled: (_data, _error, { mediaId }) => {
				queryClient.invalidateQueries({
					queryKey: favoritesKeys.detail(mediaId),
				});
			},
		});
	};

	return {
		useFavoriteItems,
		useIsFavorite,
		useToggleFavorite,
	};
}
