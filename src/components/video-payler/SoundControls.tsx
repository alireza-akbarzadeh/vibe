import { motion } from "framer-motion";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type VideoControlsProps = {
	videoRef: React.RefObject<HTMLVideoElement | null>;
};

export function SoundControls({ videoRef }: VideoControlsProps) {
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const volumeRef = useRef<HTMLDivElement>(null);

	// 1. Sync UI with Video Events (Arrow Keys & External changes)
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const syncVolume = () => {
			setVolume(video.volume);
			setIsMuted(video.muted);
		};

		// Listen for native volume changes
		video.addEventListener("volumechange", syncVolume);

		// Initial sync
		syncVolume();

		return () => video.removeEventListener("volumechange", syncVolume);
	}, [videoRef]);

	// 2. Handle manual volume bar dragging
	const handleVolumeChange = (clientX: number) => {
		if (!volumeRef.current || !videoRef.current) return;
		const rect = volumeRef.current.getBoundingClientRect();
		const newVolume = Math.min(
			Math.max((clientX - rect.left) / rect.width, 0),
			1,
		);

		// Directly update the video element; the event listener above will update the UI
		videoRef.current.volume = newVolume;
		if (newVolume > 0) videoRef.current.muted = false;
	};

	return (
		<div className="flex items-center gap-2 group/volume px-2">
			{/* Mute/Unmute button */}
			<button
				type="button"
				onClick={() => {
					if (videoRef.current)
						videoRef.current.muted = !videoRef.current.muted;
				}}
				className="text-white p-1 rounded hover:bg-white/20 transition-colors"
			>
				{isMuted || volume === 0 ? (
					<VolumeX className="size-5" />
				) : volume < 0.5 ? (
					<Volume1 className="size-5" />
				) : (
					<Volume2 className="size-5" />
				)}
			</button>

			{/* Volume Slider Container */}
			<div
				ref={volumeRef}
				className="relative w-20 h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden group-hover/volume:h-2 transition-all"
				onMouseDown={(e) => {
					setIsDragging(true);
					handleVolumeChange(e.clientX);
				}}
				onMouseMove={(e) => {
					if (isDragging) handleVolumeChange(e.clientX);
				}}
				onMouseUp={() => setIsDragging(false)}
				onMouseLeave={() => setIsDragging(false)}
			>
				{/* Background Fill (Current Volume) */}
				<motion.div
					className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none"
					initial={false}
					animate={{ width: isMuted ? "0%" : `${volume * 100}%` }}
					transition={{
						type: "spring",
						bounce: 0,
						duration: isDragging ? 0 : 0.2,
					}}
				/>
			</div>
		</div>
	);
}
