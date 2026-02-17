// Custom hook to use store with selector
import { Store, useStore } from "@tanstack/react-store";
import type { AppState } from "@/domains/library/store/library-store-types.ts";

// Initial state — only player + sidebar UI state
const initialState: AppState = {
	player: {
		isPlaying: false,
		currentTrack: null,
		currentPodcast: null,
		queue: [],
		volume: 0.8,
		progress: 0,
		shuffle: false,
		repeat: "off",
	},
	sidebarOpen: true,
};

// Create the store
export const appStore = new Store<AppState>(initialState);

export const useLibraryStore = <T>(selector: (state: AppState) => T): T => {
	return useStore(appStore, selector);
};
