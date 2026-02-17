import { motion } from "framer-motion";
import {
	Heart,
	ListMusic,
	Maximize2,
	Pause,
	Play,
	Repeat,
	Repeat1,
	Shuffle,
	SkipBack,
	SkipForward,
	Volume2,
	VolumeX,
} from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider.tsx";
import { libraryActions } from "@/domains/library/store/library-actions.ts";
import { useLibraryStore } from "@/domains/library/store/library-store.ts";
import { cn, formatPayerTime } from "@/lib/utils";

export const MiniPlayer = () => {
	const player = useLibraryStore((state) => state.player);
	const [isMuted, setIsMuted] = useState(false);
	const [prevVolume, setPrevVolume] = useState(0.8);

	const currentMedia = player.currentTrack || player.currentPodcast;

	if (!currentMedia) return null;

	const handleVolumeToggle = () => {
		if (isMuted) {
			libraryActions.setVolume(prevVolume);
			setIsMuted(false);
		} else {
			setPrevVolume(player.volume);
			libraryActions.setVolume(0);
			setIsMuted(true);
		}
	};

	const handleVolumeChange = (value: number[]) => {
		libraryActions.setVolume(value[0]);
		setIsMuted(value[0] === 0);
	};

	const duration = "duration" in currentMedia ? currentMedia.duration : 0;
	const currentTime = duration * player.progress;

	return (
		/* REMOVED: fixed, bottom-0, left-0, right-0, z-50 
		   The positioning is now handled by the Layout wrapper.
		*/
		<div className="relative w-full bg-zinc-950/80 border border-white/10 backdrop-blur-2xl md:rounded-[2rem] shadow-2xl overflow-hidden">
			{/* Progress Bar - Relative to the new rounded container */}
			<div className="absolute top-0 left-0 right-0 h-1 group cursor-pointer z-10">
				<div className="bg-white/5 h-full w-full">
					<motion.div
						className="bg-primary h-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
						initial={false}
						animate={{ width: `${player.progress * 100}%` }}
						transition={{ type: "spring", bounce: 0, duration: 0.3 }}
					/>
				</div>
				<div className="absolute inset-0 h-2 -top-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
					<Slider
						value={[player.progress * 100]}
						max={100}
						step={0.1}
						onValueChange={(value) =>
							libraryActions.setProgress(value[0] / 100)
						}
						className="h-2"
					/>
				</div>
			</div>

			<div className="h-20 px-6 flex items-center justify-between gap-4">
				{/* Track Info */}
				<div className="flex items-center gap-3 min-w-0 w-1/4">
					<motion.div className="relative shrink-0">
						<motion.img
							key={"cover" in currentMedia ? currentMedia.cover : "podcast"}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							src={"cover" in currentMedia ? currentMedia.cover : ""}
							alt={"title" in currentMedia ? currentMedia.title : ""}
							className="w-12 h-12 rounded-xl object-cover shadow-lg border border-white/5"
						/>
					</motion.div>
					<div className="min-w-0">
						<p className="text-sm font-bold text-foreground truncate tracking-tight">
							{"title" in currentMedia ? currentMedia.title : ""}
						</p>
						<p className="text-[11px] font-medium text-muted-foreground truncate uppercase tracking-wider">
							{"artist" in currentMedia
								? currentMedia.artist
								: "show" in currentMedia
									? currentMedia.show
									: ""}
						</p>
					</div>
					{player.currentTrack && (
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="ml-2 text-muted-foreground hover:text-primary transition-colors"
						>
							<Heart
								className="w-4 h-4"
							/>
						</motion.button>
					)}
				</div>

				{/* Main Controls */}
				<div className="flex flex-col items-center gap-1 flex-1 max-w-md">
					<div className="flex items-center gap-5">
						<motion.button
							whileHover={{ scale: 1.1, y: -1 }}
							whileTap={{ scale: 0.9 }}
							onClick={libraryActions.toggleShuffle}
							className={cn(
								"transition-colors",
								player.shuffle
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<Shuffle className="w-4 h-4" />
						</motion.button>

						<button className="text-muted-foreground hover:text-foreground transition-all active:scale-90">
							<SkipBack className="w-5 h-5" fill="currentColor" />
						</button>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={libraryActions.togglePlay}
							className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:bg-primary hover:text-white transition-colors"
						>
							{player.isPlaying ? (
								<Pause className="w-5 h-5" fill="currentColor" />
							) : (
								<Play className="w-5 h-5 ml-1" fill="currentColor" />
							)}
						</motion.button>

						<button className="text-muted-foreground hover:text-foreground transition-all active:scale-90">
							<SkipForward className="w-5 h-5" fill="currentColor" />
						</button>

						<motion.button
							whileHover={{ scale: 1.1, y: -1 }}
							whileTap={{ scale: 0.9 }}
							onClick={libraryActions.toggleRepeat}
							className={cn(
								"transition-colors",
								player.repeat !== "off"
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{player.repeat === "one" ? (
								<Repeat1 className="w-4 h-4" />
							) : (
								<Repeat className="w-4 h-4" />
							)}
						</motion.button>
					</div>

					{/* Time Display */}
					<div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 tabular-nums uppercase tracking-widest">
						<span>{formatPayerTime(currentTime)}</span>
						<span className="opacity-30">/</span>
						<span>{formatPayerTime(duration)}</span>
					</div>
				</div>

				{/* Right Controls */}
				<div className="flex items-center gap-4 w-1/4 justify-end">
					<button className="text-muted-foreground hover:text-foreground transition-colors">
						<ListMusic className="w-4 h-4" />
					</button>

					<div className="flex items-center gap-3 group">
						<button
							onClick={handleVolumeToggle}
							className="text-muted-foreground group-hover:text-foreground transition-colors"
						>
							{player.volume === 0 || isMuted ? (
								<VolumeX className="w-4 h-4" />
							) : (
								<Volume2 className="w-4 h-4" />
							)}
						</button>
						<div className="w-20">
							<Slider
								value={[player.volume * 100]}
								max={100}
								step={1}
								onValueChange={(v) => handleVolumeChange([v[0] / 100])}
							/>
						</div>
					</div>

					<button className="text-muted-foreground hover:text-foreground transition-colors hidden lg:block">
						<Maximize2 className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
};