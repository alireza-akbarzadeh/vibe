// Types
export interface Track {
	id: string;
	title: string;
	artist: string;
	album: string;
	cover: string;
	duration: number; // in seconds
	genre: string;
}

export interface Video {
	id: number;
	title: string;
	poster_path: string;
	duration: number;
	views: number;
	channel: string;
	channelAvatar: string;
	publishedAt: string;
	category: string;
	rating: number;
	year: number;
	genres: string[];
	progress: number;
}

export interface Blog {
	id: string;
	title: string;
	excerpt: string;
	cover: string;
	author: string;
	authorAvatar: string;
	publishedAt: string;
	readTime: number;
	category: "music" | "movies";
}

export interface Podcast {
	id: string;
	title: string;
	show: string;
	cover: string;
	duration: number;
	publishedAt: string;
	category: "music" | "movies";
}

export interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
	joinedAt: string;
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
	user: User | null;
	player: PlayerState;
	likes: {
		tracks: string[];
		videos: string[];
		blogs: string[];
		podcasts: string[];
	};
	bookmarks: {
		tracks: string[];
		videos: string[];
		blogs: string[];
		podcasts: string[];
	};
	history: {
		tracks: string[];
		videos: string[];
		blogs: string[];
		podcasts: string[];
	};
	sidebarOpen: boolean;
}
