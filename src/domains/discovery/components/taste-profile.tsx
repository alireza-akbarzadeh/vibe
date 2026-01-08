import { motion } from "framer-motion";
import { Brain, Film, Music } from "lucide-react";

import type { ArtistType } from "../discovery.domain";

interface TasteProfileProps {
	selectedArtists: ArtistType[];
}

export function TasteProfile({ selectedArtists }: TasteProfileProps) {
	const genreCount: Record<string, number> = {};
	selectedArtists.forEach((artist) => {
		artist.genres.forEach((genre) => {
			genreCount[genre] = (genreCount[genre] || 0) + 1;
		});
	});

	const topGenres = Object.entries(genreCount)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5);

	const musicCount = selectedArtists.filter((a) => a.type === "music").length;
	const movieCount = selectedArtists.filter((a) => a.type === "movie").length;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white/30 to-white/10 backdrop-blur-xl border border-white/10 p-6 md:p-8"
		>
			{/* Animated background gradient */}
			<motion.div
				animate={{
					background: [
						"radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
						"radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
						"radial-gradient(circle at 0% 100%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
					],
				}}
				transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
				className="absolute inset-0"
			/>

			<div className="relative">
				{/* Header */}
				<div className="flex items-center gap-3 mb-6">
					<motion.div
						animate={{ rotate: [0, 360] }}
						transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
						className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center"
					>
						<Brain className="w-6 h-6 text-white" />
					</motion.div>
					<div>
						<h3 className="text-xl font-bold text-white">Your Taste Profile</h3>
						<p className="text-sm text-gray-400">
							Building your personalized experience
						</p>
					</div>
				</div>

				{/* Content type breakdown */}
				<div className="grid grid-cols-2 gap-4 mb-6">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", delay: 0.1 }}
						className="p-4 rounded-2xl bg-linear-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/20"
					>
						<div className="flex items-center justify-between mb-2">
							<Music className="w-5 h-5 text-purple-400" />
							<span className="text-2xl font-bold text-white">
								{musicCount}
							</span>
						</div>
						<p className="text-sm text-gray-400">Music Artists</p>
					</motion.div>

					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", delay: 0.2 }}
						className="p-4 rounded-2xl bg-linear-to-br from-pink-600/20 to-pink-600/5 border border-pink-500/20"
					>
						<div className="flex items-center justify-between mb-2">
							<Film className="w-5 h-5 text-pink-400" />
							<span className="text-2xl font-bold text-white">
								{movieCount}
							</span>
						</div>
						<p className="text-sm text-gray-400">Movie Genres</p>
					</motion.div>
				</div>

				{/* Top genres */}
				{topGenres.length > 0 && (
					<div>
						<p className="text-sm text-gray-400 mb-3">Your top genres</p>
						<div className="flex flex-wrap gap-2">
							{topGenres.map(([genre, count], index) => (
								<motion.div
									key={genre}
									initial={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
									className="relative group"
								>
									<div className="px-4 py-2 rounded-full bg-linear-to-r from-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-sm">
										<span className="text-white font-medium text-sm">
											{genre}
										</span>
										<span className="ml-2 text-xs text-gray-400">×{count}</span>
									</div>

									{/* Tooltip effect on hover */}
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										whileHover={{ opacity: 1, y: 0 }}
										className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/90 border border-white/10 text-xs text-white whitespace-nowrap pointer-events-none"
									>
										{Math.round((count / selectedArtists.length) * 100)}% of
										your taste
									</motion.div>
								</motion.div>
							))}
						</div>
					</div>
				)}

				{/* Animated progress bar */}
				<motion.div
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: 1, delay: 0.5 }}
					className="mt-6 h-1 bg-linear-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-full origin-left"
				/>
			</div>
		</motion.div>
	);
}
