import { Store } from "@tanstack/react-store";

export interface Song {
	id: number;
	title: string;
	artist: string;
	album: string;
	albumArt: string;
	duration: number; // in seconds
	plays?: number;
	isExplicit?: boolean;
	isLiked?: boolean;
}

export interface LibraryItem {
	id: string;
	title: string;
	subtitle: string;
	type: "playlist" | "artist";
	image: string;
	isPinned?: boolean;
	isLiked: boolean;
}

export type ActiveFilter = "All" | "Playlists" | "Artists";

const initialLibrary: LibraryItem[] = [
	{
		id: "liked",
		title: "Liked Songs",
		subtitle: "Playlist • 492 songs",
		type: "playlist",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80",
		isPinned: true,
		isLiked: true,
	},
	{
		id: "ellie",
		title: "Ellie Goulding",
		subtitle: "Artist",
		type: "artist",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80",
		isPinned: true,
		isLiked: false,
	},
];

export const musicStore = new Store({
	// --- TRACK STATE ---
	currentSong: {
		id: 1,
		title: "Blinding Lights",
		artist: "The Weeknd",
		album: "After Hours",
		albumArt:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
		duration: 200,
		plays: 1200340,
		isExplicit: true,
		isLiked: false,
	} as Song,
	queue: [] as Song[],
	isPlaying: false,

	// --- PROGRESS & VOLUME ---
	currentTime: 0,
	progressPercentage: 0, // Explicitly defined to fix your error
	volume: 0.8,
	isMuted: false,

	// --- LIBRARY & SEARCH ---
	library: initialLibrary,
	searchQuery: "",
	activeFilter: "All" as ActiveFilter,

	// --- UI MODALS ---
	isAddModalOpen: false,
	isCreateModalOpen: false, // New: Separate state for creating playlists
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
	togglePlay: () => {
		musicStore.setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
	},
	toggleLike: (song: Song | null) => {
		if (!song) return;

		musicStore.setState((s) => {
			const isNowLiked = !song.isLiked;

			const updatedCurrentSong =
				s.currentSong?.id === song.id
					? { ...s.currentSong, isLiked: isNowLiked }
					: s.currentSong;

			const updatedLibrary = s.library.map((item) => {
				if (item.id === song.id.toString() || item.id === "liked") {
					if (item.id === song.id.toString()) {
						return { ...item, isLiked: isNowLiked };
					}

					if (item.id === "liked") {
						const countMatch = item.subtitle.match(/\d+/);
						const currentCount = countMatch ? parseInt(countMatch[0]) : 0;
						const newCount = isNowLiked
							? currentCount + 1
							: Math.max(0, currentCount - 1);
						return { ...item, subtitle: `Playlist • ${newCount} songs` };
					}
				}
				return item;
			});

			return {
				...s,
				currentSong: updatedCurrentSong,
				library: updatedLibrary,
			};
		});
	},

	toggleAddToPlayListModal: () => {
		musicStore.setState((s) => ({ ...s, isAddModalOpen: !s.isAddModalOpen }));
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

	openAddToPlaylist: (song: Song) => {
		musicStore.setState((s) => ({
			...s,
			isAddModalOpen: true,
			songToAddToPlaylist: song,
		}));
	},

	openOpenPlayListChange: () => {
		musicStore.setState((s) => ({
			...s,
			isAddModalOpen: !s.isAddModalOpen,
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

	setCurrentSong: (song: Song) => {
		musicStore.setState((s) => ({
			...s,
			currentSong: song,
			isPlaying: true,
			currentTime: 0,
			progressPercentage: 0,
		}));
	},

	togglePin: (id: string | number) => {
		musicStore.setState((s) => ({
			...s,
			library: s.library.map((item) =>
				item.id === id ? { ...item, isPinned: !item.isPinned } : item,
			),
		}));
	},
	setSearchQuery: (query: string) => {
		musicStore.setState((s) => ({ ...s, searchQuery: query }));
	},
	setFilter: (filter: ActiveFilter) => {
		musicStore.setState((s) => ({ ...s, activeFilter: filter }));
	},
	addLibraryItem: (item: LibraryItem) => {
		musicStore.setState((s) => ({ ...s, library: [item, ...s.library] }));
	},

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
			subtitle: `Playlist • ${description || "User"}`,
			type: "playlist",
			isLiked: false,
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80",
		};
		musicStore.setState((s) => ({
			...s,
			library: [newPlaylist, ...s.library],
		}));
	},

	removeFromLibrary: (id: string | number) => {
		musicStore.setState((s) => ({
			...s,
			library: s.library.filter((item) => item.id !== id),
		}));
	},

	addSongToPlaylistAction: (playlistId: string, song: Song | null) => {
		if (!song) return;

		musicStore.setState((s) => {
			const updatedLibrary = s.library.map((item) => {
				if (item.id === playlistId && item.type === "playlist") {
					const countMatch = item.subtitle.match(/\d+/);
					const currentCount = countMatch ? parseInt(countMatch[0]) : 0;
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
};
