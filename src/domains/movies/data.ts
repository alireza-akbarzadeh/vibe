import type { ContinueWatching, MovieTypes, Reviews } from "@/types/app";

export const continueWatching: ContinueWatching[] = [
	{
		id: 1,
		title: "Dune: Part Two",
		poster_path:
			"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
		rating: 8.8,
		year: 2024,
		genres: ["Sci-Fi", "Adventure"],
		progress: 45,
	},
	{
		id: 2,
		title: "The Batman",
		poster_path:
			"https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80",
		rating: 8.2,
		year: 2022,
		genres: ["Action", "Crime"],
		progress: 78,
	},
	{
		id: 3,
		title: "Oppenheimer",
		poster_path:
			"https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
		rating: 8.9,
		year: 2023,
		genres: ["Biography", "Drama"],
		progress: 23,
	},
];

export const latestMovies: ContinueWatching[] = [
	{
		id: 4,
		title: "Avatar: The Way of Water",
		poster_path:
			"https://images.unsplash.com/photo-1579566346927-c68383817a25?w=800&q=80",
		rating: 8.1,
		year: 2022,
		genres: ["Sci-Fi", "Adventure"],
		description:
			"Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
	},
	{
		id: 5,
		title: "Interstellar",
		poster_path:
			"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
		rating: 8.7,
		year: 2014,
		genres: ["Sci-Fi", "Drama"],
		description:
			"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
	},
	{
		id: 6,
		title: "Inception",
		poster_path:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
		rating: 8.8,
		year: 2010,
		genres: ["Action", "Thriller"],
		description:
			"A thief who steals corporate secrets through dream-sharing technology.",
	},
	{
		id: 7,
		title: "The Dark Knight",
		poster_path:
			"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
		rating: 9.0,
		year: 2008,
		genres: ["Action", "Crime"],
		description:
			"When the menace known as the Joker wreaks havoc on Gotham City.",
	},
	{
		id: 8,
		title: "Blade Runner 2049",
		poster_path:
			"https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&q=80",
		rating: 8.0,
		year: 2017,
		genres: ["Sci-Fi", "Thriller"],
		description:
			"A young blade runner unearths a secret that could plunge society into chaos.",
	},
];

export const topRated: ContinueWatching[] = [
	{
		id: 9,
		title: "The Shawshank Redemption",
		poster_path:
			"https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800&q=80",
		rating: 9.3,
		year: 1994,
		genres: ["Drama"],
		description: "Two imprisoned men bond over a number of years.",
	},
	{
		id: 10,
		title: "The Godfather",
		poster_path:
			"https://images.unsplash.com/photo-1576606089371-d5a1e1c96a46?w=800&q=80",
		rating: 9.2,
		year: 1972,
		genres: ["Crime", "Drama"],
		description:
			"The aging patriarch of an organized crime dynasty transfers control.",
	},
	{
		id: 11,
		title: "Pulp Fiction",
		poster_path:
			"https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80",
		rating: 8.9,
		year: 1994,
		genres: ["Crime", "Drama"],
		description:
			"The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine.",
	},
	{
		id: 12,
		title: "Forrest Gump",
		poster_path:
			"https://images.unsplash.com/photo-1574267432644-f610b89589c4?w=800&q=80",
		rating: 8.8,
		year: 1994,
		genres: ["Drama", "Romance"],
		description:
			"The presidencies of Kennedy and Johnson, through the eyes of an Alabama man.",
	},
];

export const popularSeries: ContinueWatching[] = [
	{
		id: 13,
		title: "Breaking Bad",
		poster_path:
			"https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&q=80",
		rating: 9.5,
		year: 2008,
		genres: ["Crime", "Drama"],
		description:
			"A high school chemistry teacher turned methamphetamine producer.",
	},
	{
		id: 14,
		title: "Stranger Things",
		poster_path:
			"https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&q=80",
		rating: 8.7,
		year: 2016,
		genres: ["Horror", "Sci-Fi"],
		description:
			"When a young boy vanishes, a small town uncovers a mystery involving secret experiments.",
	},
	{
		id: 15,
		title: "The Last of Us",
		poster_path:
			"https://images.unsplash.com/photo-1574267432644-f610b89589c4?w=800&q=80",
		rating: 8.9,
		year: 2023,
		genres: ["Action", "Drama"],
		description:
			"After a global pandemic destroys civilization, a hardened survivor takes charge.",
	},
	{
		id: 16,
		title: "Wednesday",
		poster_path:
			"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
		rating: 8.2,
		year: 2022,
		genres: ["Comedy", "Horror"],
		description:
			"Follows Wednesday Addams' years as a student at Nevermore Academy.",
	},
];

export const animation: ContinueWatching[] = [
	{
		id: 17,
		title: "Spider-Man: Into the Spider-Verse",
		poster_path:
			"https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&q=80",
		rating: 8.4,
		year: 2018,
		genres: ["Animation", "Action"],
		description: "Teen Miles Morales becomes the Spider-Man of his universe.",
	},
	{
		id: 18,
		title: "The Lion King",
		poster_path:
			"https://images.unsplash.com/photo-1564616638975-c5e34e62e545?w=800&q=80",
		rating: 8.5,
		year: 1994,
		genres: ["Animation", "Adventure"],
		description:
			"Lion prince Simba flees his kingdom after his father's death.",
	},
	{
		id: 19,
		title: "Your Name",
		poster_path:
			"https://images.unsplash.com/photo-1606603696914-3b6b85c88a85?w=800&q=80",
		rating: 8.4,
		year: 2016,
		genres: ["Animation", "Romance"],
		description: "Two strangers find themselves linked in a bizarre way.",
	},
	{
		id: 20,
		title: "Spirited Away",
		poster_path:
			"https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80",
		rating: 8.6,
		year: 2001,
		genres: ["Animation", "Fantasy"],
		description:
			"During her family's move to the suburbs, a sullen girl wanders into a world ruled by gods.",
	},
];

export const movieData: MovieTypes = {
	id: 1,
	title: "Dune: Part Two",
	year: 2024,
	poster:
		"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
	backdrop:
		"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop",
	rating: 8.8,
	votes: 2400000,
	duration: "2h 46m",
	releaseDate: "March 1, 2024",
	rating_label: "PG-13",
	genres: ["Sci-Fi", "Adventure", "Drama"],
	synopsis:
		"Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
	director: "Denis Villeneuve",
	writers: ["Jon Spaihts", "Denis Villeneuve", "Frank Herbert"],
	stars: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
	productionCo: "Legendary Pictures",
	budget: "$190M",
	revenue: "$2.8B",
	trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
	metascore: 87,
	popularity: 12,
	popularityChange: 2,
};

export const reviews: Reviews[] = [
	{
		id: 1,
		username: "JohnDoe_123",
		avatar:
			"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
		rating: 9,
		title: "A masterpiece of sci-fi cinema",
		content:
			"Dune: Part Two exceeds all expectations with breathtaking visuals, powerful performances, and a compelling narrative that stays true to Frank Herbert's vision. Denis Villeneuve has crafted a cinematic experience that will be remembered for years to come. The world-building is impeccable, and every frame is a work of art.",
		date: "2 days ago",
		helpful: 245,
		verified: true,
	},
	{
		id: 2,
		username: "MovieBuff_2024",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
		rating: 10,
		title: "Best film of the year!",
		content:
			"Simply stunning from start to finish. The cinematography alone is worth the price of admission. Timothée Chalamet and Zendaya deliver career-best performances. The score by Hans Zimmer elevates every scene. This is what blockbuster filmmaking should aspire to be.",
		date: "5 days ago",
		helpful: 189,
		verified: true,
	},
	{
		id: 3,
		username: "CinemaFan88",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
		rating: 8,
		title: "Visually spectacular, emotionally powerful",
		content:
			"While the pacing is slower than typical blockbusters, it serves the story well. The attention to detail in production design and costume work is extraordinary. Some may find it long, but I was captivated throughout.",
		date: "1 week ago",
		helpful: 156,
		verified: false,
	},
];

export const allMovies = [
	animation,
	continueWatching,
	popularSeries,
	topRated,
	latestMovies,
];
