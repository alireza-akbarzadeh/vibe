import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

interface VideoProgressbarProps {
	currentTime: number;
	duration: number;
	buffered: number;
	onSeek: (time: number) => void;
	isPlaying: boolean;
	onPause: () => void;
	onPlay: () => void;
}

export function VideoProgressbar({
	currentTime,
	duration,
	buffered, // Destructure the new prop
	isPlaying,
	onSeek,
	onPause,
	onPlay,
}: VideoProgressbarProps) {
	const barRef = useRef<HTMLDivElement>(null);
	const wasPlayingRef = useRef(false);
	const [isDragging, setIsDragging] = useState(false);
	const [hoverPos, setHoverPos] = useState<{ x: number; time: number } | null>(
		null,
	);

	const progress = duration ? (currentTime / duration) * 100 : 0;

	// Helper to format time specifically for the tooltip
	const formatTooltipTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
		if (!barRef.current || !duration) return;
		const rect = barRef.current.getBoundingClientRect();
		const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
		const percent = x / rect.width;
		const time = percent * duration;

		setHoverPos({ x, time });

		if (isDragging) {
			onSeek(time);
		}
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		wasPlayingRef.current = isPlaying;
		onPause();
		setIsDragging(true);

		// Initial seek on click
		const rect = barRef.current!.getBoundingClientRect();
		onSeek(((e.clientX - rect.left) / rect.width) * duration);

		window.addEventListener("mousemove", handleMouseMove as any);
		window.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		if (wasPlayingRef.current) onPlay();
		window.removeEventListener("mousemove", handleMouseMove as any);
		window.removeEventListener("mouseup", handleMouseUp);
	};

	return (
		<div
			className="group relative h-6 flex items-center cursor-pointer mb-2"
			onMouseMove={handleMouseMove}
			onMouseLeave={() => setHoverPos(null)}
			onMouseDown={handleMouseDown}
		>
			{/* TIME TOOLTIP */}
			<AnimatePresence>
				{hoverPos && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: -35 }}
						exit={{ opacity: 0, y: -10 }}
						className="absolute pointer-events-none bg-black/90 text-white text-[10px] px-2 py-1 rounded border border-white/10 shadow-xl z-50 font-mono"
						style={{ left: hoverPos.x, transform: "translateX(-50%)" }}
					>
						{formatTooltipTime(hoverPos.time)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* TRACK */}
			<div
				ref={barRef}
				className="relative w-full h-1 bg-white/20 rounded-full transition-all group-hover:h-1.5"
			>
				<div
					className="absolute top-0 left-0 h-full bg-white/20 transition-all duration-500 ease-out"
					style={{ width: `${buffered}%` }}
				/>
				{/* PROGRESS FILL */}
				<motion.div
					className="absolute top-0 left-0 h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full z-10"
					style={{ width: `${progress}%` }}
					transition={{
						type: "spring",
						bounce: 0,
						duration: isDragging ? 0 : 0.2,
					}}
				/>

				{/* THE DRAGGABLE KNOB (The Circle) */}
				<motion.div
					className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-white rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] border-2 border-purple-500 z-20 scale-0 group-hover:scale-100 transition-transform"
					style={{ left: `calc(${progress}% - 7px)` }}
					animate={{ scale: isDragging ? 1.3 : undefined }}
				/>

				{/* HOVER GHOST LINE (Optional: shows where you are hovering) */}
				{hoverPos && (
					<div
						className="absolute top-0 h-full bg-white/30 rounded-full z-0"
						style={{ width: hoverPos.x }}
					/>
				)}
			</div>
		</div>
	);
}
