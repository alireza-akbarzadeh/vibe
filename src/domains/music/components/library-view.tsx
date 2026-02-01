import { useStore } from "@tanstack/react-store";
import { motion } from "framer-motion";
import { Clock, Heart, Pause, Play } from "lucide-react";
// Import your stores and actions
import {
	musicStore,
	type Song,
	setCurrentSong,
	togglePlay,
} from "@/domains/music/music.store";
import { playerStore, toggleLike } from "@/domains/music/player.store";

export function LibraryView() {
	// Subscribe to stores to see what is currently happening
	const activeSongId = useStore(musicStore, (s) => s.currentSong?.id);
	const isPlaying = useStore(musicStore, (s) => s.isPlaying);
	const likedSongIds = useStore(playerStore, (s) => s.likedSongIds);

	const songs: Song[] = [
		{
			id: 1,
			title: "Blinding Lights",
			artist: "The Weeknd",
			album: "After Hours",
			albumArt:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80",
			duration: 245,
		},
		{
			id: 2,
			title: "Save Your Tears",
			artist: "The Weeknd",
			album: "After Hours",
			albumArt:
				"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80",
			duration: 215,
		},
		{
			id: 3,
			title: "Starboy",
			artist: "The Weeknd",
			album: "Starboy",
			albumArt:
				"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&q=80",
			duration: 230,
		},
	];

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleSongClick = (song: Song) => {
		if (activeSongId === song.id) {
			togglePlay();
		} else {
			setCurrentSong(song);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-b from-purple-900/40 via-black/60 to-[#0a0a0a]">
			{/* Header */}
			<div className="p-8 pb-6 pt-16">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-7xl font-black text-white mb-4 tracking-tighter"
				>
					Liked Songs
				</motion.h1>
				<div className="flex items-center gap-2 text-sm">
					<span className="text-white font-bold">Playlist</span>
					<span className="text-white opacity-60">•</span>
					<span className="text-gray-300">{songs.length} songs</span>
				</div>
			</div>

			{/* Main Play Action - Gradient Theme */}
			<div className="px-8 pb-8">
				<motion.button
					type="button"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="w-14 h-14 rounded-full bg-linear-to-br from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 flex items-center justify-center shadow-2xl transition-all"
					onClick={() => handleSongClick(songs[0])}
				>
					{activeSongId && isPlaying ? (
						<Pause className="w-7 h-7 text-white fill-white" />
					) : (
						<Play className="w-7 h-7 text-white fill-white ml-1" />
					)}
				</motion.button>
			</div>

			{/* List Header */}
			<div className="px-8">
				<div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
					<div className="text-center">#</div>
					<div>Title</div>
					<div>Album</div>
					<div className="flex items-center justify-end">
						<Clock className="w-4 h-4" />
					</div>
				</div>

				{/* Song List */}
				<div className="space-y-0.5">
					{songs.map((song, index) => {
						const isCurrent = activeSongId === song.id;

						return (
							<motion.div
								key={song.id}
								layout
								onClick={() => handleSongClick(song)}
								className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 rounded-md group cursor-pointer transition-all ${isCurrent ? "bg-white/10" : "hover:bg-white/5"
									}`}
							>
								{/* Index / Play Icon - Gradient Animation */}
								<div className="flex items-center justify-center">
									{isCurrent && isPlaying ? (
										<div className="flex items-end gap-0.5 h-3">
											<motion.div
												animate={{ height: [4, 12, 6, 12] }}
												transition={{ repeat: Infinity, duration: 0.6 }}
												className="w-0.5 bg-purple-500"
											/>
											<motion.div
												animate={{ height: [12, 4, 12, 8] }}
												transition={{ repeat: Infinity, duration: 0.7 }}
												className="w-0.5 bg-purple-500"
											/>
											<motion.div
												animate={{ height: [8, 12, 4, 12] }}
												transition={{ repeat: Infinity, duration: 0.5 }}
												className="w-0.5 bg-purple-500"
											/>
										</div>
									) : (
										<>
											<span
												className={`text-sm group-hover:hidden ${isCurrent ? "text-pink-400" : "text-gray-400"}`}
											>
												{index + 1}
											</span>
											<Play
												className={`w-3 h-3 hidden group-hover:block ${isCurrent ? "text-pink-400 fill-pink-400" : "text-white fill-white"}`}
											/>
										</>
									)}
								</div>

								{/* Title & Artist */}
								<div className="flex items-center gap-4 min-w-0">
									<img
										src={song.albumArt}
										alt=""
										className="w-10 h-10 rounded shadow-md"
									/>
									<div className="min-w-0">
										<div
											className={`font-medium truncate ${isCurrent ? "text-pink-400" : "text-white"}`}
										>
											{song.title}
										</div>
										<div className="text-sm text-gray-400 group-hover:text-white transition-colors truncate">
											{song.artist}
										</div>
									</div>
								</div>

								{/* Album */}
								<div className="flex items-center text-sm text-gray-400 group-hover:text-white transition-colors truncate">
									{song.album}
								</div>

								{/* Duration & Heart - Pink Theme */}
								<div className="flex items-center justify-end gap-4">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											toggleLike(song.id);
										}}
										className={`${likedSongIds.has(song.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
									>
										<Heart
											className={`w-4 h-4 ${likedSongIds.has(song.id)
													? "fill-pink-500 text-pink-500 border-none"
													: "text-gray-400 hover:text-white"
												}`}
										/>
									</button>
									<span className="text-gray-400 text-xs tabular-nums w-10 text-right">
										{formatTime(song.duration)}
									</span>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
