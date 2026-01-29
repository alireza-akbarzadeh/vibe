import { useStore } from "@tanstack/react-store";
import { motion } from "framer-motion";
import {
	Heart,
	ListMusic,
	Maximize2,
	Mic2,
	MonitorSpeaker,
	Pause,
	PictureInPicture2,
	Play,
	PlusCircle,
	Repeat,
	Shuffle,
	SkipBack,
	SkipForward,
	Volume2,
	VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { openAddToPlaylist, type Song } from "@/domains/music/music.store";
import {
	playerStore,
	setVolume,
	toggleLike,
	toggleMute,
	toggleShuffle,
} from "@/domains/music/player.store";

interface BottomPlayerProps {
	currentSong: Song;
	isPlaying: boolean;
	onPlayPause: () => void;
	currentTime: number;
	onTimeChange: (time: number) => void;
}

export function BottomPlayer({
	currentSong,
	isPlaying,
	onPlayPause,
	currentTime,
	onTimeChange,
}: BottomPlayerProps) {
	const { volume, isMuted, isShuffle, likedSongIds } = useStore(playerStore);
	const isLiked = likedSongIds.has(currentSong?.id);

	const progressBarRef = useRef<HTMLDivElement>(null);
	const volumeBarRef = useRef<HTMLDivElement>(null);
	const duration = currentSong.duration;

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isPlaying && currentTime < duration) {
			interval = setInterval(() => {
				onTimeChange(currentTime + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isPlaying, currentTime, duration, onTimeChange]);

	const handleProgressSeek = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!progressBarRef.current) return;
			const rect = progressBarRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const percentage = Math.max(0, Math.min(1, x / rect.width));
			onTimeChange(Math.floor(percentage * duration));
		},
		[duration, onTimeChange],
	);

	const handleVolumeSeek = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!volumeBarRef.current) return;
			const rect = volumeBarRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const percentage = Math.round(
				Math.max(0, Math.min(1, x / rect.width)) * 100,
			);
			setVolume(percentage);
		},
		[],
	);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const progressPercentage = (currentTime / duration) * 100;
	const activeVolume = isMuted ? 0 : volume;

	return (
		<motion.div
			initial={{ y: 100 }}
			animate={{ y: 0 }}
			className="fixed bottom-0 left-0 right-0 h-24 bg-black/95 backdrop-blur-md border-t border-white/5 px-4 z-100 select-none"
		>
			<div className="h-full flex items-center justify-between gap-4">
				{/* Left: Song Info (As per Screenshot) */}
				<div className="flex items-center gap-4 w-[30%] min-w-50">
					<div className="relative group">
						<img
							src={currentSong.albumArt}
							alt={currentSong.title}
							className="w-14 h-14 rounded shadow-2xl object-cover"
						/>
						<button
							type="button"
							className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-0.5"
						>
							<PictureInPicture2 className="w-3 h-3 text-white" />
						</button>
					</div>
					<div className="min-w-0">
						<div className="text-white text-[14px] font-bold truncate hover:underline cursor-pointer">
							{currentSong.title}
						</div>
						<div className="text-[#b3b3b3] text-[11px] truncate hover:text-white transition-colors cursor-pointer">
							{currentSong.artist}
						</div>
					</div>
					<div className="flex items-center gap-3 ml-2">
						<button
							type="button"
							onClick={() => toggleLike(currentSong.id)}
							className={`transition-colors ${isLiked ? "text-pink-500" : "text-[#b3b3b3] hover:text-white"}`}
						>
							<Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
						</button>

						<button
							type="button"
							title="Add to playlist"
							onClick={() => openAddToPlaylist(currentSong)}
							className="text-[#b3b3b3] hover:text-white cursor-pointer transition-colors active:scale-90"
						>
							<PlusCircle className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Center: Controls */}
				<div className="flex-1 max-w-[45%] flex flex-col items-center">
					<div className="flex items-center gap-6 mb-2">
						<button
							type="button"
							onClick={toggleShuffle}
							className={
								isShuffle
									? "text-purple-500"
									: "text-[#b3b3b3] hover:text-white"
							}
						>
							<Shuffle className="w-4 h-4" />
						</button>
						<button type="button" className="text-[#b3b3b3] hover:text-white">
							<SkipBack className="w-5 h-5 fill-current" />
						</button>

						<motion.button
							type="button"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={onPlayPause}
							className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105"
						>
							{isPlaying ? (
								<Pause className="w-5 h-5 text-black fill-current" />
							) : (
								<Play className="w-5 h-5 text-black fill-current ml-0.5" />
							)}
						</motion.button>

						<button type="button" className="text-[#b3b3b3] hover:text-white">
							<SkipForward className="w-5 h-5 fill-current" />
						</button>
						<button type="button" className="text-[#b3b3b3] hover:text-white">
							<Repeat className="w-4 h-4" />{" "}
						</button>
					</div>

					{/* Pink/Purple Theme Progress Bar */}
					<div className="flex items-center gap-2 w-full">
						<span className="text-[11px] text-[#a7a7a7] tabular-nums w-10 text-right">
							{formatTime(currentTime)}
						</span>
						<div
							ref={progressBarRef}
							onClick={handleProgressSeek}
							className="flex-1 h-[4px] bg-[#4d4d4d] rounded-full group cursor-pointer relative"
						>
							<div
								className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
								style={{ width: `${progressPercentage}%` }}
							/>
							{/* Theme Knob */}
							<div
								className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-xl transition-opacity"
								style={{ left: `calc(${progressPercentage}% - 6px)` }}
							/>
						</div>
						<span className="text-[11px] text-[#a7a7a7] tabular-nums w-10">
							{formatTime(duration)}
						</span>
					</div>
				</div>

				{/* Right: Extra Icons & Volume (As per Screenshot) */}
				<div className="flex items-center gap-3 w-[30%] justify-end">
					<button
						type="button"
						className="text-[#b3b3b3] hover:text-white transition-colors"
					>
						<Mic2 className="w-4 h-4" />
					</button>
					<button
						type="button"
						className="text-[#b3b3b3] hover:text-white transition-colors"
					>
						<ListMusic className="w-4 h-4" />
					</button>
					<button
						type="button"
						className="text-[#b3b3b3] hover:text-white transition-colors"
					>
						<MonitorSpeaker className="w-4 h-4" />
					</button>

					<div className="flex items-center gap-2 group w-32">
						<button
							type="button"
							onClick={toggleMute}
							className="text-[#b3b3b3] hover:text-white"
						>
							{isMuted || volume === 0 ? (
								<VolumeX className="w-5 h-5" />
							) : (
								<Volume2 className="w-5 h-5" />
							)}
						</button>
						{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
						<div
							ref={volumeBarRef}
							onClick={handleVolumeSeek}
							className="flex-1 h-[4px] bg-[#4d4d4d] rounded-full relative cursor-pointer"
						>
							<div
								className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
								style={{ width: `${activeVolume}%` }}
							/>
							<div
								className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-xl transition-opacity"
								style={{ left: `calc(${activeVolume}% - 6px)` }}
							/>
						</div>
					</div>
					<button
						type="button"
						className="text-[#b3b3b3] hover:text-white transition-colors"
					>
						<Maximize2 className="w-4 h-4" />
					</button>
				</div>
			</div>
		</motion.div>
	);
}
