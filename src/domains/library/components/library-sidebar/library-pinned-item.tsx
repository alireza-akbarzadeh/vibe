import { AnimatePresence, motion } from "framer-motion";
import { libraryActions } from "@/domains/library/store/library-actions.ts";
import { useLibraryStore } from "@/domains/library/store/library-store.ts";
import { cn } from "@/lib/utils.ts";

export const LibraryPinnedItem = ({
	label,
	color,
	isOpen,
	itemData,
}: {
	label: string;
	color: string;
	isOpen: boolean;
	itemData: { id: string; title: string; artist: string;[key: string]: any };
}) => {
	// 1. Monitor the store for the active track
	const currentTrackId = useLibraryStore((s) => s.player.currentTrack?.id);
	const isPlaying = useLibraryStore((s) => s.player.isPlaying);

	// 2. Determine if this specific pin is currently active
	const isActive = itemData.id === currentTrackId;

	return (
		<motion.div
			whileHover={{ x: isOpen ? 4 : 0 }}
			whileTap={{ scale: 0.97 }}
			onClick={() => libraryActions.playTrack(itemData as any)}
			className={cn(
				"relative flex items-center gap-3 px-4 py-2 cursor-pointer group transition-all duration-300",
				!isOpen && "justify-center",
				isActive && "bg-primary/5 rounded-xl", // Subtle highlight when active
			)}
		>
			{/* The Pin Dot & Pulse Aura */}
			<div className="relative shrink-0">
				<div
					className={cn(
						"w-2 h-2 rounded-full transition-all duration-500 z-10 relative",
						color,
						isActive
						&& "scale-125"

					)}
				/>

				{/* Active "Breathing" Effect */}
				{isActive && isPlaying && (
					<motion.div
						initial={{ opacity: 0, scale: 1 }}
						animate={{ opacity: [0, 0.4, 0], scale: [1, 2.5, 1] }}
						transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
						className={cn("absolute inset-0 rounded-full z-0", color)}
						style={{ filter: "blur(4px)" }}
					/>
				)}
			</div>

			{/* Label & Equalizer */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, x: -5 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -5 }}
						className="flex flex-1 items-center justify-between min-w-0"
					>
						<span
							className={cn(
								"text-xs transition-colors truncate pr-2",
								isActive
									? "text-foreground font-bold"
									: "text-muted-foreground font-medium group-hover:text-foreground",
							)}
						>
							{label}
						</span>

						{isActive && isPlaying && (
							<div className="flex gap-[1.5px] items-end h-2.5 shrink-0">
								{[0.6, 1, 0.4].map((h, i) => (
									<motion.div
										key={i}
										animate={{ height: ["20%", "100%", "20%"] }}
										transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
										className="w-[2px] bg-primary rounded-full"
									/>
								))}
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Collapsed Tooltip (Desktop Only) */}
			{!isOpen && (
				<div className="absolute left-full ml-4 px-2.5 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-2xl translate-x-2 group-hover:translate-x-0">
					{label}
					<div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45" />
				</div>
			)}
		</motion.div>
	);
};
