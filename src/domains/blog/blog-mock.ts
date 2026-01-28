import { Film, Headphones, Music, Play, Sparkles, User } from "lucide-react";

export const BLOG_CATEGORIES = [
	{ id: "all", label: "All Stories", icon: Sparkles },
	{ id: "music", label: "Music Stories", icon: Music },
	{ id: "movies", label: "Movie Reviews", icon: Film },
	{ id: "artists", label: "Artist Spotlights", icon: User },
	{ id: "behind", label: "Behind the Scenes", icon: Play },
	{ id: "playlists", label: "Playlists", icon: Headphones },
];
export type FeatureArticle = {
	id: number;

	title: string;
	excerpt: string;
	category: string;
	image: string;
	author: {
		name: string;
		avatar: string;
		role?: string;
	};
	readTime: number;
	publishDate: string;
};
export const FEATURED_ARTICLE: FeatureArticle = {
	id: 1,
	title: "The Evolution of Sound: How Electronic Music Shaped Modern Cinema",
	excerpt:
		"From Vangelis to Hans Zimmer, explore the profound relationship between electronic soundscapes and visual storytelling.",
	category: "music",
	image:
		"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
	author: {
		name: "Elena Rodriguez",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
		role: "Music Curator",
	},
	readTime: 8,
	publishDate: "Jan 25, 2026",
};

export const MOCK_ARTICLES: FeatureArticle[] = [
	{
		id: 2,
		title: "Midnight Jazz: A Playlist for the Late Hours",
		excerpt:
			"Dive into the smoky, intimate world of after-hours jazz with our carefully curated selection.",
		category: "playlists",
		image:
			"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
		author: {
			name: "Marcus Chen",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
		},
		readTime: 5,
		publishDate: "Jan 24, 2026",
	},
	{
		id: 3,
		title: "The Rise of Indie Music in 2026",
		excerpt:
			"Exploring the surge of independent artists and their impact on the music industry this year.",
		category: "music",
		image:
			"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
		author: {
			name: "Sophie Lee",
			avatar:
				"https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&q=80",
		},
		readTime: 6,
		publishDate: "Jan 23, 2026",
	},
	{
		id: 4,
		title: "Behind the Score: Movie Composers You Should Know",
		excerpt:
			"A look at the unsung heroes behind your favorite film soundtracks.",
		category: "behind",
		image:
			"https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&q=80",
		author: {
			name: "Liam Patel",
			avatar:
				"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
		},
		readTime: 7,
		publishDate: "Jan 22, 2026",
	},
	{
		id: 5,
		title: "Women Who Changed the Music Industry",
		excerpt:
			"Celebrating the trailblazing women who redefined music across genres.",
		category: "artists",
		image:
			"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&q=80",
		author: {
			name: "Ava Johnson",
			avatar:
				"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
		},
		readTime: 8,
		publishDate: "Jan 21, 2026",
	},
	{
		id: 6,
		title: "Synthwave Revival: The 80s Are Back",
		excerpt:
			"How retro synths and neon vibes are influencing today’s pop culture.",
		category: "music",
		image:
			"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80",
		author: {
			name: "Noah Kim",
			avatar:
				"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
		},
		readTime: 4,
		publishDate: "Jan 20, 2026",
	},
	{
		id: 7,
		title: "From Vinyl to Streaming: The Listening Revolution",
		excerpt:
			"Tracing the journey of music consumption from records to digital platforms.",
		category: "music",
		image:
			"https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=600&q=80",
		author: {
			name: "Emily Carter",
			avatar:
				"https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&q=80",
		},
		readTime: 6,
		publishDate: "Jan 19, 2026",
	},
	{
		id: 8,
		title: "Top 10 Movie Soundtracks of All Time",
		excerpt:
			"A countdown of the most iconic and memorable film soundtracks ever composed.",
		category: "movies",
		image:
			"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80",
		author: {
			name: "Oscar Rivera",
			avatar:
				"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
		},
		readTime: 9,
		publishDate: "Jan 18, 2026",
	},
	{
		id: 9,
		title: "How Playlists Shape Our Moods",
		excerpt:
			"The science behind why curated playlists can boost your day or help you unwind.",
		category: "playlists",
		image:
			"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
		author: {
			name: "Maya Singh",
			avatar:
				"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
		},
		readTime: 5,
		publishDate: "Jan 17, 2026",
	},
	{
		id: 10,
		title: "The Art of Album Covers",
		excerpt:
			"Exploring the visual artistry that defines music albums through the decades.",
		category: "behind",
		image:
			"https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&q=80",
		author: {
			name: "Lucas Martin",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
		},
		readTime: 7,
		publishDate: "Jan 16, 2026",
	},
	{
		id: 11,
		title: "Spotlight: Rising Artists to Watch in 2026",
		excerpt:
			"Meet the new voices and talents making waves in the music scene this year.",
		category: "artists",
		image:
			"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&q=80",
		author: {
			name: "Grace Park",
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
		},
		readTime: 6,
		publishDate: "Jan 15, 2026",
	},
	{
		id: 12,
		title: "Classic Albums Revisited: Why They Still Matter",
		excerpt:
			"A deep dive into timeless albums and their lasting influence on music lovers.",
		category: "music",
		image:
			"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
		author: {
			name: "David Kim",
			avatar:
				"https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&q=80",
		},
		readTime: 8,
		publishDate: "Jan 14, 2026",
	},
	{
		id: 13,
		title: "Soundtrack Secrets: How Music Sets the Scene",
		excerpt:
			"Discover how directors and composers use music to create unforgettable movie moments.",
		category: "movies",
		image:
			"https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&q=80",
		author: {
			name: "Isabella Rossi",
			avatar:
				"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
		},
		readTime: 7,
		publishDate: "Jan 13, 2026",
	},
];
