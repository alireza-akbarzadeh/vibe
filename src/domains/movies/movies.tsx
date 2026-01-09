import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
	CategoryNav,
	HeroBanner,
	MovieCarousel,
	SearchHeader,
} from "./components";
import { animation, continueWatching, latestMovies, popularSeries, topRated } from "./data";

export default function MovieDiscovery() {
	const [activeCategory, setActiveCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const containerRef = useRef(null);
	const { scrollYProgress } = useScroll();

	const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);



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
			<div className="relative z-10 max-w-450 mx-auto px-6 mt-20">
				<CategoryNav
					activeCategory={activeCategory}
					onCategoryChange={setActiveCategory}
				/>
			</div>

			{/* Content sections */}
			<div className="relative z-10 space-y-12 pb-10 mt-5">
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
