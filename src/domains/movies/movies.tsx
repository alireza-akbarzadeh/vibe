import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { ContinueWatching } from "@/types/app";
import {
	CategoryNav,
	HeroBanner,
	MovieCarousel,
	SearchHeader,
} from "./components";

export default function MovieDiscovery() {
	const [activeCategory, setActiveCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const containerRef = useRef(null);
	const { scrollYProgress } = useScroll();

	const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

	const continueWatching: ContinueWatching[] = [
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

	const latestMovies: ContinueWatching[] = [
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

	const topRated: ContinueWatching[] = [
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

	const popularSeries: ContinueWatching[] = [
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

	const animation: ContinueWatching[] = [
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

	return (
		<div
			ref={containerRef}
			className="min-h-screen bg-[#0a0a0a] relative overflow-hidden"
		>
			{/* Animated background layers */}
			<motion.div
				style={{ y: backgroundY }}
				className="fixed inset-0 pointer-events-none"
			>
				<div className="absolute inset-0 bg-linear-to-b from-purple-900/10 via-black to-black" />

				{/* Dynamic lighting effects */}
				<motion.div
					animate={{
						opacity: [0.3, 0.5, 0.3],
						scale: [1, 1.2, 1],
					}}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						opacity: [0.2, 0.4, 0.2],
						scale: [1.2, 1, 1.2],
					}}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
				/>

				{/* Cinematic scanlines effect */}
				<div
					className="absolute inset-0 opacity-5"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
					}}
				/>
			</motion.div>

			{/* Search header */}
			<SearchHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

			{/* Hero banner */}
			<HeroBanner />

			{/* Category navigation */}
			<div className="relative z-10 max-w-450 mx-auto px-6 -mt-20">
				<CategoryNav
					activeCategory={activeCategory}
					onCategoryChange={setActiveCategory}
				/>
			</div>

			{/* Content sections */}
			<div className="relative z-10 space-y-12 pb-20">
				{/* Continue Watching */}
				{continueWatching.length > 0 && (
					<MovieCarousel
						title="Continue Watching"
						subtitle="Pick up where you left off"
						movies={continueWatching}
						showProgress={true}
						variant="large"
					/>
				)}

				{/* Latest Movies */}
				<MovieCarousel
					title="Latest Releases"
					subtitle="Fresh from the cinema"
					movies={latestMovies}
					variant="featured"
				/>

				{/* Top Rated */}
				<MovieCarousel
					title="Top Rated"
					subtitle="Highest rated by critics and audiences"
					movies={topRated}
					variant="standard"
				/>

				{/* Popular Series */}
				<MovieCarousel
					title="Popular Series"
					subtitle="Binge-worthy shows everyone's talking about"
					movies={popularSeries}
					variant="standard"
				/>

				{/* Animation */}
				<MovieCarousel
					title="Animation"
					subtitle="Animated masterpieces for all ages"
					movies={animation}
					variant="standard"
				/>

				{/* Recommended */}
				<MovieCarousel
					title="Recommended For You"
					subtitle="Based on your viewing history"
					movies={[...latestMovies, ...topRated]
						.sort(() => Math.random() - 0.5)
						.slice(0, 6)}
					variant="personalized"
				/>
			</div>
		</div>
	);
}
