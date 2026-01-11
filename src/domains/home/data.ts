import type { MoodKey } from "./recommendation";

export const recommendations: Record<
	MoodKey,
	{ type: string; title: string; artist: string; image: string }[]
> = {
	energetic: [
		{
			type: "music",
			title: "Power Anthems",
			artist: "Various Artists",
			image:
				"https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Mad Max: Fury Road",
			artist: "Action",
			image:
				"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop",
		},
		{
			type: "music",
			title: "Workout Beast Mode",
			artist: "DJ Thunder",
			image:
				"https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Top Gun",
			artist: "Action",
			image:
				"https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?w=400&h=400&fit=crop",
		},
	],
	chill: [
		{
			type: "music",
			title: "Lo-Fi Dreams",
			artist: "Sleepy Beats",
			image:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Lost in Translation",
			artist: "Drama",
			image:
				"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=400&fit=crop",
		},
		{
			type: "music",
			title: "Rainy Day Jazz",
			artist: "Mellow Collective",
			image:
				"https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Her",
			artist: "Sci-Fi Romance",
			image:
				"https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=400&fit=crop",
		},
	],
	romantic: [
		{
			type: "music",
			title: "Love Songs",
			artist: "Various Artists",
			image:
				"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "The Notebook",
			artist: "Romance",
			image:
				"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop",
		},
		{
			type: "music",
			title: "Midnight Slow Dance",
			artist: "Luna Rose",
			image:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "La La Land",
			artist: "Musical",
			image:
				"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
		},
	],
	dark: [
		{
			type: "music",
			title: "Dark Synthwave",
			artist: "Neon Void",
			image:
				"https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "Blade Runner 2049",
			artist: "Sci-Fi",
			image:
				"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop",
		},
		{
			type: "music",
			title: "Industrial Nights",
			artist: "Chrome Shadows",
			image:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
		},
		{
			type: "movie",
			title: "The Matrix",
			artist: "Sci-Fi",
			image:
				"https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=400&fit=crop",
		},
	],
};
