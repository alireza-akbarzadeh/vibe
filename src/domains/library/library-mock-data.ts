import type { Podcast, Track } from "./store/library-store-types";

// Deprecated types — kept only for backward compatibility with this mock file
interface Video {
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

interface Blog {
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

// Mock Tracks
export const mockTracks: Track[] = [
	{
		id: "track-1",
		title: "Midnight Dreams",
		artist: "Luna Eclipse",
		album: "Celestial Waves",
		cover:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
		duration: 234,
		genre: "Electronic",
	},
	{
		id: "track-2",
		title: "Ocean Breeze",
		artist: "Coastal Drift",
		album: "Summer Tides",
		cover:
			"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
		duration: 198,
		genre: "Chill",
	},
	{
		id: "track-3",
		title: "Urban Nights",
		artist: "City Pulse",
		album: "Neon Streets",
		cover:
			"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
		duration: 267,
		genre: "Hip-Hop",
	},
	{
		id: "track-4",
		title: "Electric Soul",
		artist: "Synth Masters",
		album: "Retro Future",
		cover:
			"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
		duration: 312,
		genre: "Synthwave",
	},
	{
		id: "track-5",
		title: "Forest Rain",
		artist: "Nature Sound",
		album: "Ambient Earth",
		cover:
			"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop",
		duration: 245,
		genre: "Ambient",
	},
	{
		id: "track-6",
		title: "Golden Hour",
		artist: "Sunset Collective",
		album: "Dusk Till Dawn",
		cover:
			"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
		duration: 289,
		genre: "Indie",
	},
	{
		id: "track-7",
		title: "Velocity",
		artist: "Tempo Drive",
		album: "High Speed",
		cover:
			"https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop",
		duration: 203,
		genre: "EDM",
	},
	{
		id: "track-8",
		title: "Starlight Serenade",
		artist: "Cosmic Orchestra",
		album: "Interstellar",
		cover:
			"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=300&fit=crop",
		duration: 356,
		genre: "Classical",
	},
];

// Mock Videos
export const mockVideos: Video[] = [
	{
		id: 1,
		title: "The Art of Storytelling in Modern Cinema",
		poster_path:
			"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
		duration: 1245,
		views: 1250000,
		channel: "Film Academy",
		channelAvatar:
			"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop",
		publishedAt: "2024-12-15",
		category: "Documentary",
		rating: 8.5,
		genres: ["comedy"],
		year: 2022,
		progress: 65,
	},
	{
		id: 2,
		title: "Behind the Scenes: Epic Movie Soundtracks",
		poster_path:
			"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop",
		duration: 892,
		views: 890000,
		channel: "Sound Design Pro",
		channelAvatar:
			"https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop",
		publishedAt: "2024-12-20",
		category: "Music",
		rating: 8.5,
		genres: ["comedy"],
		year: 2022,
		progress: 30,
	},
	{
		id: 3,
		title: "Concert Highlights: World Tour 2024",
		poster_path:
			"https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=225&fit=crop",
		duration: 2156,
		views: 3400000,
		channel: "Live Music TV",
		channelAvatar:
			"https://images.unsplash.com/photo-1494790108755-2616b612b1a4?w=50&h=50&fit=crop",
		publishedAt: "2024-12-22",
		category: "Concert",
		rating: 8.5,
		genres: ["comedy"],
		year: 2022,
		progress: 30,
	},
	{
		id: 4,
		title: "Visual Effects Breakdown: Sci-Fi Masterpiece",
		poster_path:
			"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=225&fit=crop",
		duration: 1567,
		views: 2100000,
		channel: "VFX Wizards",
		channelAvatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
		publishedAt: "2024-12-18",
		category: "Tutorial",
		rating: 8.5,
		genres: ["comedy"],
		year: 2022,
		progress: 22,
	},
	{
		id: 5,
		title: "Indie Film Festival Highlights",
		poster_path:
			"https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=225&fit=crop",
		duration: 3024,
		views: 560000,
		channel: "Indie Spotlight",
		channelAvatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
		publishedAt: "2024-12-10",
		category: "Festival",
		rating: 8.5,
		genres: ["comedy"],
		year: 2021,
		progress: 30,
	},
	{
		id: 6,
		title: "Music Production Masterclass",
		poster_path:
			"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=225&fit=crop",
		duration: 4521,
		views: 780000,
		channel: "Producer Academy",
		channelAvatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
		publishedAt: "2024-12-05",
		category: "Education",
		rating: 8.5,
		genres: ["comedy"],
		year: 2022,
		progress: 30,
	},
];

// Mock Blogs
export const mockBlogs: Blog[] = [
	{
		id: "blog-1",
		title: "The Evolution of Electronic Music: From Kraftwerk to Today",
		excerpt:
			"Exploring how electronic music transformed from experimental sounds in German studios to dominating global charts and festival stages.",
		cover:
			"https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=400&fit=crop",
		author: "Marcus Chen",
		authorAvatar:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop",
		publishedAt: "2024-12-28",
		readTime: 8,
		category: "music",
	},
	{
		id: "blog-2",
		title: "Why Practical Effects Still Matter in CGI Era",
		excerpt:
			"Despite advances in digital technology, many filmmakers still prefer practical effects. We explore why tactile filmmaking endures.",
		cover:
			"https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=400&fit=crop",
		author: "Sarah Mitchell",
		authorAvatar:
			"https://images.unsplash.com/photo-1494790108755-2616b612b1a4?w=50&h=50&fit=crop",
		publishedAt: "2024-12-25",
		readTime: 12,
		category: "movies",
	},
	{
		id: "blog-3",
		title: "The Rise of K-Pop: A Global Phenomenon",
		excerpt:
			"How Korean pop music conquered the world through perfect choreography, catchy hooks, and unprecedented fan engagement.",
		cover:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
		author: "Ji-Young Park",
		authorAvatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
		publishedAt: "2024-12-20",
		readTime: 10,
		category: "music",
	},
	{
		id: "blog-4",
		title: "Auteur Theory in the Streaming Age",
		excerpt:
			"Does the director-as-artist concept still hold relevance when algorithms determine what we watch? A deep dive into modern auteurism.",
		cover:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop",
		author: "David Laurent",
		authorAvatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
		publishedAt: "2024-12-15",
		readTime: 15,
		category: "movies",
	},
	{
		id: "blog-5",
		title: "Vinyl Revival: Why Gen-Z Loves Records",
		excerpt:
			"The unexpected resurgence of vinyl records among young listeners challenges our assumptions about digital music consumption.",
		cover:
			"https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=600&h=400&fit=crop",
		author: "Emma Rodriguez",
		authorAvatar:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop",
		publishedAt: "2024-12-10",
		readTime: 7,
		category: "music",
	},
	{
		id: "blog-6",
		title: "The Art of Movie Scoring: Composing Emotions",
		excerpt:
			"From John Williams to Hans Zimmer, discover how film composers craft the emotional backbone of cinema.",
		cover:
			"https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=400&fit=crop",
		author: "Thomas Wright",
		authorAvatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
		publishedAt: "2024-12-05",
		readTime: 11,
		category: "movies",
	},
];

export interface Recents extends Track {
	type: "track" | "podcast";
}

export const recents: Recents[] = [
	{
		id: "t1",
		title: "Midnight City",
		artist: "M83",
		album: "Hurry Up, We're Dreaming",
		cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300",
		duration: 244,
		genre: "Electronic",
		type: "track",
	},
	{
		id: "t2",
		title: "Lofi Beats",
		artist: "ChilledCow",
		album: "Late Night Vibes",
		cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300",
		duration: 180,
		genre: "Lo-Fi",
		type: "podcast",
	},
];
// Mock Podcasts
export const mockPodcasts: Podcast[] = [
	{
		id: "podcast-1",
		title: "The Making of a Hit Song",
		show: "Behind the Music",
		cover:
			"https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=300&fit=crop",
		duration: 3540,
		publishedAt: "2024-12-27",
		category: "music",
		artist: "ChilledCow",
		genres: "Lo-Fi",
	},
	{
		id: "podcast-2",
		title: "Directors Commentary: Oscar Winners",
		show: "Cinema Secrets",
		cover:
			"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=300&fit=crop",
		duration: 4200,
		publishedAt: "2024-12-24",
		category: "movies",
		artist: "Cinema Secrets",
		genres: "Documentary",
	},
	{
		id: "podcast-3",
		title: "Jazz Legends: The Blue Note Era",
		show: "Groove Sessions",
		cover:
			"https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&h=300&fit=crop",
		duration: 2890,
		publishedAt: "2024-12-21",
		category: "music",
		artist: "Groove Sessions",
		genres: "Jazz",
	},
	{
		id: "podcast-4",
		title: "Horror Movies: Why We Love to Be Scared",
		show: "Film Psychology",
		cover:
			"https://images.unsplash.com/photo-1509248961895-40a78c62ffc4?w=300&h=300&fit=crop",
		duration: 3120,
		publishedAt: "2024-12-18",
		category: "movies",
		artist: "Film Psychology",
		genres: "Horror",
	},
	{
		id: "podcast-5",
		title: "Indie Artists Breaking the Mainstream",
		show: "Underground Sounds",
		cover:
			"https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=300&h=300&fit=crop",
		duration: 2650,
		publishedAt: "2024-12-15",
		category: "music",
		artist: "Underground Sounds",
		genres: "Indie",
	},
	{
		id: "podcast-6",
		title: "Sci-Fi Cinema: Predicting the Future",
		show: "Future Watch",
		cover:
			"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=300&fit=crop",
		duration: 3890,
		publishedAt: "2024-12-12",
		category: "movies",
		artist: "Future Watch",
		genres: "Sci-Fi",
	},
];
