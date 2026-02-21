import { Store } from "@tanstack/react-store";
import { orpc } from "@/orpc/client";

export interface Song {
	id: string;
	title: string;
	artist: string;
	album: string;
	albumArt: string;
	duration: number; // in seconds
	plays?: number;
	isExplicit?: boolean;
	isLiked?: boolean;
	mediaId?: string; // API mediaId for favorites/watchlist
}

export interface LibraryItem {
	id: string;
	title: string;
	subtitle: string;
	type: "playlist" | "artist" | "favorites" | "watchlist";
	image: string;
	isPinned?: boolean;
	isLiked: boolean;
}

export type ActiveFilter = "All" | "Playlists" | "Artists";

export const musicStore = new Store({
	// --- TRACK STATE ---
	currentSong: null as Song | null,
	queue: [] as Song[],
	isPlaying: false,

	// --- PROGRESS & VOLUME ---
	currentTime: 0,
	progressPercentage: 0,
	volume: 0.8,
	isMuted: false,

	// --- LIBRARY & SEARCH ---
	library: [] as LibraryItem[],
	searchQuery: "",
	activeFilter: "All" as ActiveFilter,

	// --- UI MODALS ---
	isAddModalOpen: false,
	isCreateModalOpen: false,
	songToAddToPlaylist: null as Song | null,

	// --- VIEW STATES ---
	isSidebarCollapsed: false,
	showLyrics: false,
	showQueue: false,
	showDevices: false,
	isFullscreen: false,
});

// --- Action Helpers ---

export const musicAction = {
	// --- PLAYBACK CONTROLS ---
	togglePlay: () => {
		musicStore.setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
	},

	updateCurrentTime: (time: number) => {
		musicStore.setState((s) => {
			const duration = s.currentSong?.duration || 1;
			return {
				...s,
				currentTime: time,
				progressPercentage: (time / duration) * 100,
			};
		});
	},

	skipNext: () => {
		musicStore.setState((s) => {
			if (s.queue.length === 0) return s;
			const nextSong = s.queue[0];
			return {
				...s,
				currentSong: nextSong,
				queue: s.queue.slice(1),
				currentTime: 0,
				progressPercentage: 0,
				isPlaying: true,
			};
		});
	},

	skipPrevious: () => {
		musicStore.setState((s) => ({
			...s,
			currentTime: 0,
			progressPercentage: 0,
		}));
	},

	setCurrentSong: (song: Song) => {
		musicStore.setState((s) => ({
			...s,
			currentSong: song,
			isPlaying: true,
			currentTime: 0,
			progressPercentage: 0,
		}));
	},

	// --- FAVORITES (API INTEGRATED) ---
	toggleLike: async (song: Song | null) => {
		if (!song || !song.mediaId) return;

		try {
			if (song.isLiked) {
				// Remove from favorites
				await client.favorites.remove({ mediaId: song.mediaId });

				musicStore.setState((s) => {
					const updatedCurrentSong =
						s.currentSong?.id === song.id
							? { ...s.currentSong, isLiked: false }
							: s.currentSong;

					// Update favorites count in library
					const updatedLibrary = s.library.map((item) => {
						if (item.type === "favorites") {
							const countMatch = item.subtitle.match(/\\d+/);
							const currentCount = countMatch
								? Number.parseInt(countMatch[0], 10)
								: 0;
							return {
								...item,
								subtitle: `${Math.max(0, currentCount - 1)} songs`,
							};
						}
						return item;
					});

					return {
						...s,
						currentSong: updatedCurrentSong,
						library: updatedLibrary,
					};
				});
			} else {
				// Add to favorites
				await client.favorites.add({ mediaId: song.mediaId });

				musicStore.setState((s) => {
					const updatedCurrentSong =
						s.currentSong?.id === song.id
							? { ...s.currentSong, isLiked: true }
							: s.currentSong;

					// Update favorites count in library
					const updatedLibrary = s.library.map((item) => {
						if (item.type === "favorites") {
							const countMatch = item.subtitle.match(/\\d+/);
							const currentCount = countMatch
								? Number.parseInt(countMatch[0], 10)
								: 0;
							return {
								...item,
								subtitle: `${currentCount + 1} songs`,
							};
						}
						return item;
					});

					return {
						...s,
						currentSong: updatedCurrentSong,
						library: updatedLibrary,
					};
				});
			}
		} catch (error) {
			console.error("Failed to toggle like:", error);
		}
	},

	// --- LIBRARY MANAGEMENT (API INTEGRATED) ---
	loadLibrary: async () => {
		try {
			const [favoritesRes, watchlistRes] = await Promise.all([
				client.favorites.list({ page: 1, limit: 1 }),
				client.watchlist.list({ page: 1, limit: 1 }),
			]);

			const library: LibraryItem[] = [
				{
					id: "favorites",
					title: "Liked Songs",
					subtitle: `${favoritesRes.data.pagination.total} songs`,
					type: "favorites",
					image:
						"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80",
					isPinned: true,
					isLiked: true,
				},
				{
					id: "watchlist",
					title: "My Watchlist",
					subtitle: `${watchlistRes.data.pagination.total} items`,
					type: "watchlist",
					image:
						"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&q=80",
					isPinned: true,
					isLiked: false,
				},
			];

			musicStore.setState((s) => ({ ...s, library }));
		} catch (error) {
			console.error("Failed to load library:", error);
		}
	},

	togglePin: (id: string | number) => {
		musicStore.setState((s) => ({
			...s,
			library: s.library.map((item) =>
				item.id === id ? { ...item, isPinned: !item.isPinned } : item,
			),
		}));
	},

	removeFromLibrary: (id: string | number) => {
		musicStore.setState((s) => ({
			...s,
			library: s.library.filter((item) => item.id !== id),
		}));
	},

	addLibraryItem: (item: LibraryItem) => {
		musicStore.setState((s) => ({ ...s, library: [item, ...s.library] }));
	},

	// --- WATCHLIST (API INTEGRATED) ---
	addToWatchlist: async (mediaId: string) => {
		try {
			await client.watchlist.add({ mediaId });

			musicStore.setState((s) => {
				const updatedLibrary = s.library.map((item) => {
					if (item.type === "watchlist") {
						const countMatch = item.subtitle.match(/\\d+/);
						const currentCount = countMatch
							? Number.parseInt(countMatch[0], 10)
							: 0;
						return {
							...item,
							subtitle: `${currentCount + 1} items`,
						};
					}
					return item;
				});

				return { ...s, library: updatedLibrary };
			});
		} catch (error) {
			console.error("Failed to add to watchlist:", error);
		}
	},

	removeFromWatchlist: async (mediaId: string) => {
		try {
			await client.watchlist.remove({ mediaId });

			musicStore.setState((s) => {
				const updatedLibrary = s.library.map((item) => {
					if (item.type === "watchlist") {
						const countMatch = item.subtitle.match(/\\d+/);
						const currentCount = countMatch
							? Number.parseInt(countMatch[0], 10)
							: 0;
						return {
							...item,
							subtitle: `${Math.max(0, currentCount - 1)} items`,
						};
					}
					return item;
				});

				return { ...s, library: updatedLibrary };
			});
		} catch (error) {
			console.error("Failed to remove from watchlist:", error);
		}
	},

	// --- PLAYLIST MODALS ---
	toggleAddToPlayListModal: () => {
		musicStore.setState((s) => ({ ...s, isAddModalOpen: !s.isAddModalOpen }));
	},

	openAddToPlaylist: (song: Song) => {
		musicStore.setState((s) => ({
			...s,
			isAddModalOpen: true,
			songToAddToPlaylist: song,
		}));
	},

	closeAddToPlaylist: () => {
		musicStore.setState((s) => ({
			...s,
			isAddModalOpen: false,
			songToAddToPlaylist: null,
		}));
	},

	openCreatePlaylist: () => {
		musicStore.setState((s) => ({
			...s,
			isCreateModalOpen: true,
			isAddModalOpen: false,
		}));
	},

	// TODO: Implement with Collection API
	createPlaylist: ({
		description,
		name,
	}: {
		name: string;
		description: string;
	}) => {
		const newPlaylist: LibraryItem = {
			id: Math.random().toString(36).substr(2, 9),
			title: name,
			subtitle: `Playlist • ${description || "No description"}`,
			type: "playlist",
			isLiked: false,
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80",
		};
		musicStore.setState((s) => ({
			...s,
			library: [newPlaylist, ...s.library],
			isCreateModalOpen: false,
		}));
	},

	addSongToPlaylistAction: (playlistId: string, song: Song | null) => {
		if (!song) return;

		musicStore.setState((s) => {
			const updatedLibrary = s.library.map((item) => {
				if (item.id === playlistId && item.type === "playlist") {
					const countMatch = item.subtitle.match(/\\d+/);
					const currentCount = countMatch
						? Number.parseInt(countMatch[0], 10)
						: 0;
					return {
						...item,
						subtitle: `Playlist • ${currentCount + 1} songs`,
					};
				}
				return item;
			});

			return {
				...s,
				library: updatedLibrary,
				isAddModalOpen: false,
				songToAddToPlaylist: null,
			};
		});
	},

	// --- UI CONTROLS ---
	toggleLyrics: () =>
		musicStore.setState((s) => ({ ...s, showLyrics: !s.showLyrics })),

	toggleQueue: (_id: number) =>
		musicStore.setState((s) => ({ ...s, showQueue: !s.showQueue })),

	toggleDevices: () =>
		musicStore.setState((s) => ({ ...s, showDevices: !s.showDevices })),

	toggleFullscreen: () =>
		musicStore.setState((s) => ({ ...s, isFullscreen: !s.isFullscreen })),

	toggleSidebar: () =>
		musicStore.setState((s) => ({
			...s,
			isSidebarCollapsed: !s.isSidebarCollapsed,
		})),

	// --- SEARCH & FILTER ---
	setSearchQuery: (query: string) => {
		musicStore.setState((s) => ({ ...s, searchQuery: query }));
	},

	setFilter: (filter: ActiveFilter) => {
		musicStore.setState((s) => ({ ...s, activeFilter: filter }));
	},
};
