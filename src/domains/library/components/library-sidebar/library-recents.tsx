import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { libraryActions } from "@/domains/library/store/library-actions.ts";
import { useLibraryStore } from "@/domains/library/store/library-store.ts";
import type { Track } from "@/domains/library/store/library-store-types.ts";
import { cn } from "@/lib/utils.ts";

interface RecentItem extends Track {
	type: "track" | "podcast";
	img: string;
	publishedAt?: string;
}

// Placeholder recents — replace with real API data when available
const recentItems: RecentItem[] = [
	{
		id: "t1",
		title: "Midnight City",
		artist: "M83",
		album: "Hurry Up, We're Dreaming",
		cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300",
		img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300",
		duration: 244,
		genre: "Electronic",
		type: "track",
	},
	{
		id: "t2",
		title: "Lofi Beats",
		artist: "ChilledCow",
		album: "Late Night Vibes",
		cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300",
		img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300",
		duration: 180,
		genre: "Lo-Fi",
		type: "podcast",
	},
];

export const LibraryRecent = ({ isOpen }: { isOpen: boolean }) => {
	const currentTrackId = useLibraryStore((s) => s.player.currentTrack?.id);
	const currentPodcastId = useLibraryStore((s) => s.player.currentPodcast?.id);
	const isPlaying = useLibraryStore((s) => s.player.isPlaying);

	const handlePlay = (item: RecentItem) => {
		if (item.type === "track") {
			libraryActions.playTrack({
				id: item.id,
				title: item.title,
				artist: item.artist,
				cover: item.cover,
				album: item.album,
				duration: item.duration,
				genre: item.genre,
			});
		} else {
			libraryActions.playPodcast({
				id: item.id,
				title: item.title,
				show: item.artist,
				cover: item.cover,
				duration: item.duration,
				category: "movies",
				publishedAt: item.publishedAt || "",
				genres: "",
				artist: item.artist,
			});
		}
	};

	return (
		<div
			className={cn("px-4 py-2 mt-4", !isOpen && "flex flex-col items-center")}
		>
			{isOpen && (
				<p className="px-4 text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] mb-3">
					Recent
				</p>
			)}
			<div
				className={cn(
					"flex items-center group/stack",
					isOpen ? "gap-0 px-2" : "flex-col gap-3",
				)}
			>
				{recentItems.map((item, i) => {
					const isActive =
						item.id === currentTrackId || item.id === currentPodcastId;

					return (
						<motion.div
							key={item.id}
							onClick={() => handlePlay(item)}
							whileHover={{
								y: -8,
								scale: 1.15,
								zIndex: 50,
								marginRight: isOpen ? "12px" : "0px",
							}}
							className={cn(
								"relative cursor-pointer transition-all duration-300",
								isOpen && i !== 0 && "-ml-3",
								"group-hover/stack:opacity-50 hover:opacity-100!",
							)}
						>
							<div className="relative overflow-hidden rounded-xl shadow-2xl">
								<img
									src={item.img}
									className={cn(
										"w-9 h-9 object-cover ring-2 ring-zinc-950 transition-all",
										isActive ? "ring-primary" : "group-hover:ring-primary/50",
									)}
									alt={item.title}
								/>

								{/* Play/Pause Overlay */}
								<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
									{isActive && isPlaying ? (
										<Pause className="w-4 h-4 text-white fill-current" />
									) : (
										<Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
									)}
								</div>

								{/* Now Playing Pulse Dot */}
								{isActive && isPlaying && (
									<div className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
								)}
							</div>

							{/* Premium Tooltip */}
							{isOpen && (
								<div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-2xl z-[60]">
									<p className="text-[10px] font-bold text-white whitespace-nowrap tracking-tight">
										{item.title}
									</p>
									<p className="text-[9px] text-muted-foreground whitespace-nowrap text-center">
										{item.artist}
									</p>
								</div>
							)}
						</motion.div>
					);
				})}
			</div>
		</div>
	);
};
