import { Calendar, Clock, PlayCircle, Star, Youtube } from "lucide-react";
import { LikeButton } from "@/components/buttons/like-button";
import { WatchListButton } from "@/components/buttons/watchlist-button";
import { motion } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MovieTypes } from "@/types/app";

interface MovieHeroProps {
	movie: MovieTypes;
	onClick?: (type: "movie" | "trailer") => void;
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1, delayChildren: 0.3 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

export function MovieHero({ movie, onClick }: MovieHeroProps) {
	return (
		<section className="relative min-h-screen h-screen w-full flex items-center overflow-hidden">
			{/* Background Image with Ken Burns Effect */}
			<motion.div
				initial={{ scale: 1.05, opacity: 0.8 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 15, ease: "easeInOut" }}
				className="absolute inset-0"
			>
				<img
					src={movie.backdrop}
					alt={movie.title}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
				<div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/50 via-transparent to-transparent" />
			</motion.div>

			{/* Content */}
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12 w-full grid md:grid-cols-12 gap-12 items-end"
			>
				{/* Poster */}
				<motion.div
					variants={itemVariants}
					className="col-span-12 md:col-span-4 lg:col-span-3"
				>
					<motion.div
						whileHover={{ scale: 1.05, rotate: -2 }}
						transition={{ type: "spring", stiffness: 300 }}
						className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-2 border-white/10"
					>
						<img
							src={movie.poster}
							alt={movie.title}
							className="w-full h-full object-cover"
						/>
					</motion.div>
				</motion.div>

				{/* Movie Details */}
				<div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
					<motion.h1
						variants={itemVariants}
						className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none drop-shadow-lg"
					>
						{movie.title}
					</motion.h1>

					<motion.div
						variants={itemVariants}
						className="flex flex-wrap items-center gap-x-4 gap-y-2"
					>
						<div className="flex items-center gap-2 text-yellow-400">
							<Star className="w-5 h-5 fill-current" />
							<span className="text-lg font-bold text-white">
								{movie.rating.toFixed(1)}
							</span>
						</div>
						<div className="flex items-center gap-2 text-gray-300">
							<Calendar className="w-5 h-5" />
							<span className="text-lg font-medium">{movie.year}</span>
						</div>
						<div className="flex items-center gap-2 text-gray-300">
							<Clock className="w-5 h-5" />
							<span className="text-lg font-medium">
								{`${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`}
							</span>
						</div>
					</motion.div>

					<motion.div variants={itemVariants} className="max-w-2xl">
						<p className="text-gray-300 text-lg leading-relaxed line-clamp-3">
							{movie.synopsis}
						</p>
					</motion.div>

					<motion.div variants={itemVariants} className="flex flex-wrap gap-2">
						{movie.genres.map((genre) => (
							<Badge
								key={genre}
								variant="outline"
								className="text-sm backdrop-blur-sm bg-white/5 border-white/10 text-gray-300"
							>
								{genre}
							</Badge>
						))}
					</motion.div>

					<motion.div
						variants={itemVariants}
						className="flex items-center gap-3 pt-4"
					>
						<Button
							size="lg"
							className="bg-white text-black font-bold hover:bg-gray-200 h-14 px-8 text-lg rounded-full shadow-lg shadow-white/20"
							onClick={() => onClick?.("movie")}
						>
							<PlayCircle className="w-6 h-6 mr-2" />
							Play Movie
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-2 border-white/20 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 h-14 px-8 text-lg rounded-full"
							onClick={() => onClick?.("trailer")}
						>
							<Youtube className="w-6 h-6 mr-2" />
							Watch Trailer
						</Button>
						<div className="w-px h-8 bg-white/20 mx-2" />
						<LikeButton mediaId={movie.id} />
						<WatchListButton mediaId={movie.id} />
					</motion.div>
				</div>
			</motion.div>
		</section>
	);
}
