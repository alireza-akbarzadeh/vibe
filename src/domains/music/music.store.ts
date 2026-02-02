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
}

export interface LibraryItem {
	id: string;
	title: string;
	subtitle: string;
	type: "playlist" | "artist";
	image: string;
	isPinned?: boolean;
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
	},
	{
		id: "ellie",
		title: "Ellie Goulding",
		subtitle: "Artist",
		type: "artist",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80",
		isPinned: true,
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
	} as Song | null,
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

export const togglePlay = () => {
	musicStore.setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
};

/**
 * Updates both time and percentage to keep UI in sync
 */
export const updateCurrentTime = (time: number) => {
	musicStore.setState((s) => {
		const duration = s.currentSong?.duration || 1;
		return {
			...s,
			currentTime: time,
			progressPercentage: (time / duration) * 100,
		};
	});
};

export const skipNext = () => {
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
};

export const skipPrevious = () => {
	musicStore.setState((s) => ({ ...s, currentTime: 0, progressPercentage: 0 }));
};

// --- UI Toggles ---
export const toggleLyrics = () =>
	musicStore.setState((s) => ({ ...s, showLyrics: !s.showLyrics }));
export const toggleQueue = () =>
	musicStore.setState((s) => ({ ...s, showQueue: !s.showQueue }));
export const toggleDevices = () =>
	musicStore.setState((s) => ({ ...s, showDevices: !s.showDevices }));
export const toggleFullscreen = () =>
	musicStore.setState((s) => ({ ...s, isFullscreen: !s.isFullscreen }));
export const toggleSidebar = () =>
	musicStore.setState((s) => ({
		...s,
		isSidebarCollapsed: !s.isSidebarCollapsed,
	}));

// --- Playlist & Library Actions ---
export const openAddToPlaylist = (song: Song) => {
	musicStore.setState((s) => ({
		...s,
		isAddModalOpen: true,
		songToAddToPlaylist: song,
	}));
};

export const closeAddToPlaylist = () => {
	musicStore.setState((s) => ({
		...s,
		isAddModalOpen: false,
		songToAddToPlaylist: null,
	}));
};

export const openCreatePlaylist = () => {
	musicStore.setState((s) => ({
		...s,
		isCreateModalOpen: true,
		isAddModalOpen: false,
	}));
};

export const setCurrentSong = (song: Song) => {
	musicStore.setState((s) => ({
		...s,
		currentSong: song,
		isPlaying: true,
		currentTime: 0,
		progressPercentage: 0,
	}));
};

export const togglePin = (id: string | number) => {
	musicStore.setState((s) => ({
		...s,
		library: s.library.map((item) =>
			item.id === id ? { ...item, isPinned: !item.isPinned } : item,
		),
	}));
};

export const setSearchQuery = (query: string) => {
	musicStore.setState((s) => ({ ...s, searchQuery: query }));
};

export const setFilter = (filter: ActiveFilter) => {
	musicStore.setState((s) => ({ ...s, activeFilter: filter }));
};

export const addLibraryItem = (item: LibraryItem) => {
	musicStore.setState((s) => ({ ...s, library: [item, ...s.library] }));
};

export const createPlaylist = (name: string, description: string) => {
	const newPlaylist: LibraryItem = {
		id: Math.random().toString(36).substr(2, 9),
		title: name,
		subtitle: `Playlist • ${description || "User"}`,
		type: "playlist",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80",
	};
	musicStore.setState((s) => ({ ...s, library: [newPlaylist, ...s.library] }));
};

export const removeFromLibrary = (id: string | number) => {
	musicStore.setState((s) => ({
		...s,
		library: s.library.filter((item) => item.id !== id),
	}));
};
