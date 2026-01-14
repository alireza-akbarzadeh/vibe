import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { MovieItem } from "@/domains/movies/components/movie-list.tsx";

export type SimilarMoviesType = {
	id: number;
	title: string;
	year: number;
	rating: number;
	duration: string;
	poster: string;
};

export function SimilarMovies() {
	const movies: SimilarMoviesType[] = [
		{
			id: 1,
			title: "Oppenheimer",
			year: 2023,
			rating: 8.6,
			duration: "3h 1m",
			poster:
				"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
		},
		{
			id: 2,
			title: "Interstellar",
			year: 2014,
			rating: 8.7,
			duration: "2h 49m",
			poster:
				"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop",
		},
		{
			id: 3,
			title: "Blade Runner 2049",
			year: 2017,
			rating: 8.0,
			duration: "2h 44m",
			poster:
				"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
		},
		{
			id: 4,
			title: "Arrival",
			year: 2016,
			rating: 7.9,
			duration: "1h 56m",
			poster:
				"https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&h=450&fit=crop",
		},
		{
			id: 5,
			title: "The Martian",
			year: 2015,
			rating: 8.0,
			duration: "2h 24m",
			poster:
				"https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
		},
		{
			id: 6,
			title: "Inception",
			year: 2010,
			rating: 8.8,
			duration: "2h 28m",
			poster:
				"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=450&fit=crop",
		},
	];

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
						{movies.map((movie, index) => (
							<MovieItem movie={movie} index={index} key={movie.id} />
						))}
					</div>

					<div className="flex justify-center mt-12">
						<Button
							variant="outline"
							className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50 rounded-full px-8"
						>
							View All Similar Movies
							<span className="ml-2 text-gray-400">(124 more)</span>
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
