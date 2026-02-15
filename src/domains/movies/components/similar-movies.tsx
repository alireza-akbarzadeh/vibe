import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MovieItem } from "@/domains/movies/components/movie-list.tsx";
import type { MediaListItem } from "@/orpc/models/media.schema";

export type SimilarMoviesType = {
	id: number;
	title: string;
	year: number;
	rating: number;
	duration: string;
	poster: string;
};

interface SimilarMoviesProps {
	movies?: MediaListItem[];
}

export function SimilarMovies({ movies }: SimilarMoviesProps) {
	// Transform API data to component format
	const similarMovies: SimilarMoviesType[] =
		movies?.map((media) => ({
			id: Number(media.id) || 0,
			title: media.title,
			year: media.releaseYear || 0,
			rating: media.rating || 0,
			duration: media.duration
				? `${Math.floor(media.duration / 60)}h ${media.duration % 60}m`
				: "N/A",
			poster: media.backdropPath
				? `https://image.tmdb.org/t/p/w500${media.backdropPath}`
				: media.posterPath
					? `https://image.tmdb.org/t/p/w500${media.posterPath}`
					: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
		})) || [];

	// Don't render section if no similar movies
	if (similarMovies.length === 0) {
		return null;
	}

	return (
		<section className="relative py-20 bg-[#0a0a0a]">
			<div className="max-w-7xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
						More Like This
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{similarMovies.map((movie, index) => (
							<MovieItem movie={movie} index={index} key={movie.id} />
						))}
					</div>

					{similarMovies.length >= 6 && (
						<div className="flex justify-center mt-12">
							<Button
								variant="outline"
								className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50 rounded-full px-8"
							>
								View All Similar Movies
							</Button>
						</div>
					)}
				</motion.div>
			</div>
		</section>
	);
}
