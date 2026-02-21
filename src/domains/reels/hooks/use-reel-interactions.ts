import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import { updateReelAction } from "../reels.store";
import type { VideoReel } from "../reels.types";

export function useReelInteractions(video: VideoReel) {
	const { mutate: toggleLike } = useMutation({
		mutationFn: async () => {
			return client.favorites.toggle({ mediaId: video.id });
		},
		onMutate: () => {
			// Optimistic update
			updateReelAction(video.id, "like");
		},
		onError: (error) => {
			console.error("Failed to toggle like", error);
			// Rollback
			updateReelAction(video.id, "like");
		},
	});

	const { mutate: toggleSave } = useMutation({
		mutationFn: async () => {
			return client.watchlist.toggle({ mediaId: video.id });
		},
		onMutate: () => {
			updateReelAction(video.id, "save");
		},
		onError: (error) => {
			console.error("Failed to toggle save", error);
			updateReelAction(video.id, "save");
		},
	});

	return { toggleLike, toggleSave };
}
