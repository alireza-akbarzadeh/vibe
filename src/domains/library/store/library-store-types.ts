// Types
export interface Track {
	id: string;
	title: string;
	artist: string;
	album: string;
	cover: string;
	duration: number;
	genre: string;
}

export interface Podcast {
	id: string;
	title: string;
	show: string;
	cover: string;
	duration: number;
	publishedAt: string;
	genres: string;
	artist: string;
	category: "music" | "movies";
}

export interface PlayerState {
	isPlaying: boolean;
	currentTrack: Track | null;
	currentPodcast: Podcast | null;
	queue: Track[];
	volume: number;
	progress: number;
	shuffle: boolean;
	repeat: "off" | "all" | "one";
}

export interface AppState {
	player: PlayerState;
	sidebarOpen: boolean;
}
