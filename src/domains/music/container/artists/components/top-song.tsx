import { motion } from "framer-motion";
import { Heart, MoreHorizontal, Music, Pause, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TopSongs({ songs }) {
	const [playingId, setPlayingId] = useState(null);
	const [likedSongs, setLikedSongs] = useState([]);

	const handlePlayPause = (songId) => {
		setPlayingId(playingId === songId ? null : songId);
	};

	const handleLike = (songId) => {
		setLikedSongs((prev) =>
			prev.includes(songId)
				? prev.filter((id) => id !== songId)
				: [...prev, songId],
		);
	};

	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6 }}
		>
			<div className="mb-8">
				<h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
					Popular
				</h2>
				<p className="text-gray-400">Most played songs</p>
			</div>

			<div className="space-y-2">
				{songs.map((song, index) => (
					<motion.div
						key={song.id}
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.05, duration: 0.4 }}
						onMouseEnter={() => setPlayingId(song.id)}
						className="group relative p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer"
					>
						<div className="flex items-center gap-6">
							{/* Number / Play button */}
							<div className="relative w-6 text-center">
								<span className="text-gray-400 font-medium group-hover:opacity-0 transition-opacity">
									{index + 1}
								</span>
								<motion.button
									initial={{ opacity: 0, scale: 0.5 }}
									whileHover={{ scale: 1.1 }}
									onClick={() => handlePlayPause(song.id)}
									className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
								>
									{playingId === song.id ? (
										<Pause className="w-5 h-5 text-white fill-white" />
									) : (
										<Play className="w-5 h-5 text-white fill-white" />
									)}
								</motion.button>
							</div>

							{/* Album art */}
							<div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
								<img
									src={song.albumArt}
									alt={song.album}
									className="w-full h-full object-cover"
								/>
								{playingId === song.id && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
									>
										<motion.div
											animate={{ scale: [1, 1.2, 1] }}
											transition={{ duration: 1, repeat: Infinity }}
										>
											<Music className="w-5 h-5 text-white" />
										</motion.div>
									</motion.div>
								)}
							</div>

							{/* Song info */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<h3 className="text-white font-semibold text-lg truncate">
										{song.title}
									</h3>
									{song.isExplicit && (
										<span className="px-1.5 py-0.5 rounded text-xs bg-gray-700 text-gray-300 font-medium">
											E
										</span>
									)}
								</div>
								<p className="text-gray-400 text-sm">{song.plays} plays</p>
							</div>

							{/* Album name (hidden on mobile) */}
							<div className="hidden md:block text-gray-400 text-sm w-48 truncate">
								{song.album}
							</div>

							{/* Duration */}
							<div className="text-gray-400 text-sm w-16 text-right">
								{song.duration}
							</div>

							{/* Actions */}
							<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={(e) => {
										e.stopPropagation();
										handleLike(song.id);
									}}
									className="p-2 rounded-full hover:bg-white/10 transition-colors"
								>
									<Heart
										className={`w-5 h-5 transition-colors ${
											likedSongs.includes(song.id)
												? "fill-purple-500 text-purple-500"
												: "text-gray-400"
										}`}
									/>
								</motion.button>

								<Button
									variant="ghost"
									size="icon"
									className="w-10 h-10 rounded-full hover:bg-white/10 text-gray-400"
								>
									<MoreHorizontal className="w-5 h-5" />
								</Button>
							</div>
						</div>

						{/* Playing indicator */}
						{playingId === song.id && (
							<motion.div
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-r-full origin-left"
							/>
						)}
					</motion.div>
				))}
			</div>
		</motion.section>
	);
}
