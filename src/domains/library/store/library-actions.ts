// Actions — player + sidebar UI state only
import { appStore } from "@/domains/library/store/library-store.ts";
import type {
	Podcast,
	Track,
} from "@/domains/library/store/library-store-types.ts";

export const libraryActions = {
	// Player actions
	playTrack: (track: Track) => {
		appStore.setState((state) => ({
			...state,
			player: {
				...state.player,
				isPlaying: true,
				currentTrack: track,
				currentPodcast: null,
				progress: 0,
			},
		}));
	},

	playPodcast: (podcast: Podcast) => {
		appStore.setState((state) => ({
			...state,
			player: {
				...state.player,
				isPlaying: true,
				currentPodcast: podcast,
				currentTrack: null,
				progress: 0,
			},
		}));
	},

	togglePlay: () => {
		appStore.setState((state) => ({
			...state,
			player: {
				...state.player,
				isPlaying: !state.player.isPlaying,
			},
		}));
	},

	setVolume: (volume: number) => {
		appStore.setState((state) => ({
			...state,
			player: {
				...state.player,
				volume: Math.max(0, Math.min(1, volume)),
			},
		}));
	},

	setProgress: (progress: number) => {
		appStore.setState((state) => ({
			...state,
			player: {
				...state.player,
				progress,
			},
		}));
	},

	toggleShuffle: () => {
		appStore.setState((state) => ({
			...state,
			player: {
				...state.player,
				shuffle: !state.player.shuffle,
			},
		}));
	},

	toggleRepeat: () => {
		appStore.setState((state) => {
			const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
			const currentIndex = modes.indexOf(state.player.repeat);
			const nextMode = modes[(currentIndex + 1) % modes.length];
			return {
				...state,
				player: {
					...state.player,
					repeat: nextMode,
				},
			};
		});
	},

	addToQueue: (track: Track) => {
		appStore.setState((state) => ({
			...state,
			player: {
				...state.player,
				queue: [...state.player.queue, track],
			},
		}));
	},

	// UI actions
	toggleSidebar: () => {
		appStore.setState((state) => ({
			...state,
			sidebarOpen: !state.sidebarOpen,
		}));
	},

	setSidebarOpen: (open: boolean) => {
		appStore.setState((state) => ({
			...state,
			sidebarOpen: open,
		}));
	},
};
