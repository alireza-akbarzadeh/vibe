import { motion } from "framer-motion";
import {
	Calendar,
	ChevronDown,
	Clock,
	Heart,
	Play,
	Plus,
	Share2,
	Star,
	Tag,
	TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MovieTypes } from "@/types/app";

interface MovieHeroProps {
	movie: MovieTypes;
}

export function MovieHero({ movie }: MovieHeroProps) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({
				x: (e.clientX / window.innerWidth - 0.5) * 20,
				y: (e.clientY / window.innerHeight - 0.5) * 20,
			});
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<section className="relative min-h-screen flex items-center overflow-hidden">
			{/* Background with parallax */}
			<div className="absolute inset-0">
				<motion.div
					style={{
						transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
					}}
					transition={{ type: "spring", stiffness: 50 }}
					className="absolute inset-0 scale-110"
				>
					<img
						src={movie.backdrop}
						alt={movie.title}
						className="w-full h-full object-cover blur-3xl"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/60" />
					<div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />
				</motion.div>

				{/* Floating orbs */}
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.15, 0.25, 0.15],
					}}
					transition={{ duration: 8, repeat: Infinity }}
					className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.1, 0.2, 0.1],
					}}
					transition={{ duration: 10, repeat: Infinity }}
					className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"
				/>

				{/* Grid overlay */}
				<div
					className="absolute inset-0 opacity-5"
					style={{
						backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
				<div className="grid md:grid-cols-[400px_1fr] gap-12 items-center">
					{/* Poster */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="relative group"
					>
						<motion.div
							whileHover={{ scale: 1.05, rotate: -2 }}
							transition={{ duration: 0.3 }}
							className="relative"
						>
							<img
								src={movie.poster}
								alt={movie.title}
								className="w-full rounded-2xl shadow-2xl shadow-purple-500/20"
							/>
							<div className="absolute inset-0 rounded-2xl bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</motion.div>
					</motion.div>

					{/* Movie Info */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="space-y-6"
					>
						{/* Breadcrumb */}
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<span className="hover:text-white transition-colors cursor-pointer">
								Home
							</span>
							<span>/</span>
							<span className="hover:text-white transition-colors cursor-pointer">
								Movies
							</span>
							<span>/</span>
							<span className="text-white">{movie.genres[0]}</span>
						</div>

						{/* Title and Year */}
						<div className="space-y-3">
							<h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
								{movie.title}
							</h1>
							<Badge className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1.5 text-base">
								{movie.year}
							</Badge>
						</div>

						{/* Rating */}
						<div className="flex items-center gap-6 p-4 rounded-2xl bg-white/3 backdrop-blur-xl border border-white/10">
							<div className="flex items-center gap-3">
								<Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
								<div>
									<div className="text-3xl font-bold text-white">
										{movie.rating}/10
									</div>
									<div className="text-sm text-gray-400">
										{(movie.votes / 1000000).toFixed(1)}M reviews
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2 text-green-400">
								<TrendingUp className="w-5 h-5" />
								<span className="text-sm font-medium">Trending</span>
							</div>
						</div>

						{/* Genres */}
						<div className="flex flex-wrap gap-2">
							{movie.genres.map((genre, index) => (
								<motion.div
									key={genre}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 + index * 0.1 }}
								>
									<Badge
										variant="outline"
										className="bg-white/3 backdrop-blur-md border-white/20 text-gray-300 hover:bg-white/[0.08] hover:border-purple-500/50 transition-all px-4 py-1.5 cursor-pointer"
									>
										{genre}
									</Badge>
								</motion.div>
							))}
						</div>

						{/* Metadata */}
						<div className="flex flex-wrap gap-6 text-gray-300">
							<div className="flex items-center gap-2">
								<Clock className="w-5 h-5 text-gray-500" />
								<span>{movie.duration}</span>
							</div>
							<div className="flex items-center gap-2">
								<Calendar className="w-5 h-5 text-gray-500" />
								<span>{movie.releaseDate}</span>
							</div>
							<div className="flex items-center gap-2">
								<Tag className="w-5 h-5 text-gray-500" />
								<span>{movie.rating_label}</span>
							</div>
						</div>

						{/* Synopsis */}
						<p className="text-gray-300 text-lg leading-relaxed line-clamp-3">
							{movie.synopsis}
						</p>

						{/* Action Buttons */}
						<div className="flex flex-wrap gap-4 pt-4">
							<Button
								size="lg"
								className="group bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
							>
								<Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
								Watch Trailer
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-full px-8"
							>
								<Plus className="w-5 h-5 mr-2" />
								Watchlist
							</Button>
							<Button
								size="lg"
								variant="ghost"
								className="bg-white/5 hover:bg-white/10 text-white rounded-full"
							>
								<Heart className="w-5 h-5" />
							</Button>
							<Button
								size="lg"
								variant="ghost"
								className="bg-white/5 hover:bg-white/10 text-white rounded-full"
							>
								<Share2 className="w-5 h-5" />
							</Button>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Infinity }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
			>
				<span className="text-sm">Scroll for more</span>
				<ChevronDown className="w-6 h-6" />
			</motion.div>
		</section>
	);
}
