import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Play, Plus, Star, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { FeaturedMovie } from "@/types/app";

export function HeroBanner() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isMuted, setIsMuted] = useState(true);

	const featured: FeaturedMovie[] = [
		{
			title: "Dune: Part Two",
			description:
				"Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family. Facing a choice between the love of his life and the fate of the universe.",
			image:
				"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
			rating: 8.8,
			year: 2024,
			genres: ["Sci-Fi", "Adventure", "Drama"],
			runtime: "166 min",
			movieId: 1,
		},
		{
			title: "Oppenheimer",
			description:
				"The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
			image:
				"https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&q=80",
			rating: 8.9,
			year: 2023,
			genres: ["Biography", "Drama", "History"],
			runtime: "180 min",
			movieId: 2,
		},
		{
			title: "Interstellar",
			description:
				"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces environmental collapse.",
			image:
				"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80",
			rating: 8.7,
			year: 2014,
			genres: ["Sci-Fi", "Drama", "Adventure"],
			runtime: "169 min",
			movieId: 3,
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % featured.length);
		}, 8000);
		return () => clearInterval(timer);
	}, []);

	const current = featured[currentIndex];

	return (
		<div className="relative h-screen w-full overflow-hidden">
			{/* Background images with parallax */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentIndex}
					initial={{ opacity: 0, scale: 1.1 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 1.2, ease: "easeInOut" }}
					className="absolute inset-0"
				>
					<div className="absolute inset-0">
						<img
							src={current.image}
							alt={current.title}
							className="w-full h-full object-cover"
						/>

						{/* Multi-layer gradients for depth */}
						<div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
						<div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent" />
						<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black" />
					</div>
				</motion.div>
			</AnimatePresence>

			{/* Content */}
			<div className="relative z-10 h-full flex items-end pb-32">
				<div className="max-w-450 mx-auto px-6 w-full">
					<div className="max-w-2xl">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentIndex}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -30 }}
								transition={{ duration: 0.8, ease: "easeOut" }}
							>
								{/* Title */}
								<motion.h1
									initial={{ opacity: 0, x: -50 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2, duration: 0.8 }}
									className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
									style={{
										textShadow:
											"0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(139, 92, 246, 0.3)",
									}}
								>
									{current.title}
								</motion.h1>

								{/* Metadata */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
									className="flex items-center gap-4 mb-6 flex-wrap"
								>
									<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30">
										<Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
										<span className="text-yellow-500 font-bold">
											{current.rating}
										</span>
									</div>
									<span className="text-white font-semibold">
										{current.year}
									</span>
									<span className="text-gray-400">{current.runtime}</span>
									<div className="flex gap-2">
										{current.genres.slice(0, 3).map((genre) => (
											<span
												key={genre}
												className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm"
											>
												{genre}
											</span>
										))}
									</div>
								</motion.div>

								{/* Description */}
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.6 }}
									className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl"
								>
									{current.description}
								</motion.p>

								{/* Buttons */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.8 }}
									className="flex items-center gap-4 flex-wrap"
								>
									<Link
										to="/movies/$movieId"
										params={{ movieId: current.movieId.toString() }}
										className="h-14 px-8 flex items-center bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-lg group transition-all shadow-2xl shadow-white/20"
									>
										<Play className="w-5 h-5 mr-2 fill-black group-hover:scale-110 transition-transform" />
										Play Now
									</Link>

									<Button
										variant="outline"
										className="h-14 px-8 bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 rounded-xl font-semibold text-lg group"
									>
										<Info className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
										More Info
									</Button>

									<Button
										variant="ghost"
										className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white group"
									>
										<Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
									</Button>

									<Button
										variant="ghost"
										onClick={() => setIsMuted(!isMuted)}
										className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white"
									>
										{isMuted ? (
											<VolumeX className="w-5 h-5" />
										) : (
											<Volume2 className="w-5 h-5" />
										)}
									</Button>
								</motion.div>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>

			{/* Progress indicators */}
			<div className="absolute bottom-8 right-8 z-20 flex gap-2">
				{featured.map((movie, index) => (
					<Button
						variant="text"
						key={movie.movieId}
						onClick={() => setCurrentIndex(index)}
						className="relative group"
					>
						<div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
							<motion.div
								initial={{ width: "0%" }}
								animate={{
									width: currentIndex === index ? "100%" : "0%",
								}}
								transition={{ duration: currentIndex === index ? 8 : 0 }}
								className="h-full bg-white rounded-full"
							/>
						</div>
					</Button>
				))}
			</div>

			{/* Scroll indicator */}
			<motion.div
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Infinity }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60"
			>
				<span className="text-sm">Scroll to explore</span>
				<div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
					<motion.div
						animate={{ y: [0, 12, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="w-1 h-2 bg-white/60 rounded-full"
					/>
				</div>
			</motion.div>
		</div>
	);
}
