import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Info, Play, Star } from "lucide-react";
import { AddButton } from "@/components/buttons/add-button";
import { Button } from "@/components/ui/button";
import type { SimilarMoviesType } from "@/domains/movies/components/similar-movies.tsx";
import { MovieInfoDialog } from "./movie-info-dialog";

interface MovieListProps {
	movie: SimilarMoviesType;
	index: number;
}
export function MovieItem(props: MovieListProps) {
	const { movie, index } = props;
	const navigate = useNavigate();
	return (
		<motion.div
			key={movie.id}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.1, duration: 0.5 }}
			className="group cursor-pointer"
		>
			<div className="relative aspect-2/3 rounded-2xl overflow-hidden mb-3">
				<img
					src={movie.poster}
					alt={movie.title}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
				/>

				<div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
				<div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
					<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
					<span className="text-white text-xs font-medium">{movie.rating}</span>
				</div>

				<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
					<div className="flex flex-col gap-2 p-4">
						<Button
							onClick={() =>
								navigate({
									to: "/movies/$movieId",
									params: { movieId: movie.id },
								})
							}
							size="sm"
							className="bg-linear-to-r z-20 from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full"
						>
							<Play className="w-4 h-4 mr-1 fill-current" />
							Play
						</Button>
						<div className="flex gap-2 justify-center">
							<AddButton
								iconSize="x-small"
								className="rounded-full border-none  bg-white/10 hover:bg-white/20 text-white h-8 w-8 z-20"
								size="icon"
							/>
							<MovieInfoDialog
								mediaId={movie.id}
								triggerButton={
									<Button
										size="icon"
										variant="ghost"
										className="rounded-full z-20 bg-white/10 hover:bg-white/20 text-white h-8 w-8"
									>
										<Info className="w-4 h-4" />
									</Button>
								}
							/>
						</div>
					</div>
				</div>

				{/* Border glow on hover */}
				<div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-500 transition-colors" />
			</div>

			{/* Info */}
			<div className="space-y-1">
				<h3 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">
					{movie.title}
				</h3>
				<p className="text-sm text-gray-500">
					{movie.year} • {movie.duration}
				</p>
			</div>
		</motion.div>
	);
}
