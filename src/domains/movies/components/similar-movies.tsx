import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Info, Play, Star } from "lucide-react";
import { AddButton } from "@/components/buttons/add-button";
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/lib/utils";
import { MovieInfoDialog } from "./movie-info-dialog";

interface SimilarMoviesProps {
	movieId: number;
}

export function SimilarMovies({ movieId }: SimilarMoviesProps) {
	const navigate = useNavigate()

	const movies = [
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
										<span className="text-white text-xs font-medium">
											{movie.rating}
										</span>
									</div>

									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
										<div className="flex flex-col gap-2 p-4">
											<Button
												onClick={() => navigate({ to: "/movies/$movieId", params: { movieId: generateSlug(movie.title) } })}
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
												<MovieInfoDialog triggerButton={
													<Button
														size="icon"
														variant="ghost"
														className="rounded-full z-20 bg-white/10 hover:bg-white/20 text-white h-8 w-8"
													>
														<Info className="w-4 h-4" />
													</Button>
												} />

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
