import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Clock, Play, Star, Tag, TrendingUp } from "lucide-react";
import { LikeButton } from "@/components/buttons/like-button";
import { SharedButton } from "@/components/buttons/share-button";
import { WatchListButton } from "@/components/buttons/watchlist-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MovieTypes } from "@/types/app";

interface MovieInfoProps {
	movie: MovieTypes;
	onClick?: (type: "movie" | "trailer") => void;
	showBreadCrumb?: boolean;
	component?: "dialog" | "standard";
}

export default function MovieInfo(props: MovieInfoProps) {
	const {
		movie,
		onClick,
		showBreadCrumb = true,
		component = "standard",
	} = props;
	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.8, delay: 0.2 }}
			className="space-y-6"
		>
			{/* Breadcrumb */}
			{showBreadCrumb && (
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
			)}

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
							className="bg-white/3 backdrop-blur-md border-white/20 text-gray-300 hover:bg-white/8 hover:border-purple-500/50 transition-all px-4 py-1.5 cursor-pointer"
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
					onClick={() => {
						if (component === "dialog") {
							navigate({
								to: "/movies/$movieId",
								params: { movieId: movie.id.toString() },
							});
							return;
						}
						onClick?.("movie");
					}}
					size="lg"
					className="rounded-full px-8 flex items-center bg-white text-black hover:bg-gray-200  font-bold text-lg group transition-all shadow-2xl shadow-white/20"
				>
					<Play className="w-5 h-5 mr-2 fill-black group-hover:scale-110 transition-transform" />
					Play Now
				</Button>
				<Button
					onClick={() => {
						if (component === "dialog") {
							navigate({
								to: "/movies/$movieId",
								params: { movieId: movie.id.toString() },
							});
							return;
						}
						onClick?.("trailer");
					}}
					size="lg"
					className="group bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
				>
					<Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
					Watch Trailer
				</Button>
				<WatchListButton mediaId={movie.id} />
				<LikeButton mediaId={movie.id} />
				<SharedButton />
			</div>
		</motion.div>
	);
}
