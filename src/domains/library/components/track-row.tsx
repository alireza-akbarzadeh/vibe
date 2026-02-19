import { Clock, Heart, Pause, Play } from "lucide-react";
import { motion } from "@/components/motion";
import type { Track } from "@/domains/library/store/library-store-types.ts";
import { cn, formatDuration } from "@/lib/utils";

interface TrackRowProps {
	track: Track;
	index: number;
	isPlaying?: boolean;
	isActive?: boolean;
	onPlay: () => void;
}

export const TrackRow = ({
	track,
	index,
	isPlaying,
	isActive,
	onPlay,
}: TrackRowProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.05 }}
			whileHover={{ backgroundColor: "hsl(var(--card-hover))" }}
			className={cn(
				"group grid grid-cols-[40px_4fr_3fr_1fr_40px] gap-4 items-center px-4 py-3 rounded-lg cursor-pointer transition-colors",
				isActive && "bg-card",
			)}
			onClick={onPlay}
		>
			{/* Index / Play */}
			<div className="flex items-center justify-center w-8">
				<span
					className={cn(
						"text-sm font-medium group-hover:hidden",
						isActive ? "text-primary" : "text-muted-foreground",
					)}
				>
					{index + 1}
				</span>
				<button className="hidden group-hover:block" onClick={onPlay}>
					{isPlaying && isActive ? (
						<Pause className="w-4 h-4 text-primary" fill="currentColor" />
					) : (
						<Play className="w-4 h-4 text-foreground" fill="currentColor" />
					)}
				</button>
			</div>

			{/* Track Info */}
			<div className="flex items-center gap-3 min-w-0">
				<img
					src={track.cover}
					alt={track.title}
					className="w-10 h-10 rounded object-cover"
				/>
				<div className="min-w-0">
					<p
						className={cn(
							"font-medium truncate",
							isActive ? "text-primary" : "text-foreground",
						)}
					>
						{track.title}
					</p>
					<p className="text-sm text-muted-foreground truncate">
						{track.artist}
					</p>
				</div>
			</div>

			{/* Album */}
			<p className="text-sm text-muted-foreground truncate hidden md:block">
				{track.album}
			</p>

			{/* Duration */}
			<p className="text-sm text-muted-foreground text-right">
				{formatDuration(track.duration)}
			</p>

			{/* Actions */}
			<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="text-muted-foreground hover:text-foreground transition-colors"
				>
					<Heart className="w-4 h-4" />
				</motion.button>
			</div>
		</motion.div>
	);
};

export const TrackListHeader = () => (
	<div className="grid grid-cols-[40px_4fr_3fr_1fr_40px] gap-4 items-center px-4 py-2 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
		<div className="text-center">#</div>
		<div>Title</div>
		<div className="hidden md:block">Album</div>
		<div className="flex items-center justify-end">
			<Clock className="w-4 h-4" />
		</div>
		<div></div>
	</div>
);
