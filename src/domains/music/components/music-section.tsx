import { useStore } from "@tanstack/react-store";
import {
	ChevronLeft,
	ChevronRight,
	Heart,
	MoreVertical,
	Play,
	Sparkles,
} from "lucide-react";
import { useRef } from "react";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
	musicAction,
	musicStore,
	type Song,
} from "@/domains/music/music.store";
import { cn } from "@/lib/utils";

// --- Enhanced Types ---
interface MusicItem {
	id: number;
	title?: string;
	name?: string;
	artist?: string;
	role?: string;
	image: string;
	plays?: string;
	isTrending?: boolean;
	isLiked?: boolean;
	duration?: string;
}

interface MusicSectionProps {
	title: string;
	items: MusicItem[];
	variant?: "square" | "circle";
}

export function MusicSection({
	title,
	items,
	variant = "square",
}: MusicSectionProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = direction === "left" ? -400 : 400;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};
	const convertToSong = (item: MusicItem): Song => ({
		id: item.id,
		title: item.title || item.name || "Unknown",
		artist: item.artist || "Various Artists",
		album: "Single",
		albumArt: item.image,
		duration: 180, // Default duration
		isLiked: false,
	});
	const handlePlay = (e: React.MouseEvent, item: MusicItem) => {
		e.stopPropagation(); // Prevents triggering other card clicks

		// Mapping UI item to Store Song structure
		const songData: Song = {
			id: item.id,
			title: item.title || item.name || "Unknown",
			artist: item.artist || "Various Artists",
			album: "Single",
			albumArt: item.image,
			duration: 180, // Defaulting for now
			isLiked: false,
		};

		musicAction.setCurrentSong(songData);
	};
	const handleLike = (e: React.MouseEvent, item: MusicItem) => {
		e.stopPropagation(); // Stop the card from playing
		const song = convertToSong(item);
		musicAction.toggleLike(song);
	};

	const handleMore = (e: React.MouseEvent, item: MusicItem) => {
		e.stopPropagation();
		const song = convertToSong(item);
		musicAction.openAddToPlaylist(song);
	};
	const library = useStore(musicStore, (s) => s.library);
	return (
		<section className="mb-14 relative group/section">
			<div className="flex items-center justify-between mb-6 px-4 md:px-0">
				<div className="flex items-center gap-3">
					<h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase">
						{title}
					</h2>
					<div className="h-1 w-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-full hidden md:block" />
				</div>

				<div className="flex items-center gap-4">
					<button className="text-[10px] font-black text-zinc-500 hover:text-pink-500 transition-colors uppercase tracking-[0.2em]">
						View All
					</button>
					<div className="hidden md:flex gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => scroll("left")}
							className="size-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
						>
							<ChevronLeft className="size-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => scroll("right")}
							className="size-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-pink-500/20 hover:border-pink-500/50 transition-all"
						>
							<ChevronRight className="size-5" />
						</Button>
					</div>
				</div>
			</div>

			<div
				ref={scrollRef}
				className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-0 pb-6"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{items.map((item, index) => {
					const isCurrentlyLiked =
						item.isLiked ||
						library.some((l) => l.id === item.id.toString() && l.isLiked);
					return (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.05 }}
							className="min-w-[170px] md:min-w-[200px] snap-start group cursor-pointer"
						>
							{/* THE CARD IMAGE CONTAINER */}
							<div className="relative mb-4">
								<div
									className={cn(
										"aspect-square overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl transition-all duration-500 ease-out group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:border-white/20",
										variant === "circle" ? "rounded-full" : "rounded-2xl",
									)}
								>
									<img
										src={item.image}
										alt={item.title || item.name}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
									/>

									{/* Overlay Gradient on Hover */}
									<div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>

								{/* Floating Labels */}
								{item.isTrending && (
									<div className="absolute top-2 left-2 px-2 py-1 bg-purple-600/90 backdrop-blur-md rounded-md flex items-center gap-1 border border-white/20">
										<Sparkles className="size-3 text-white animate-pulse" />
										<span className="text-[8px] font-black uppercase text-white">
											Hot
										</span>
									</div>
								)}

								{item.duration && (
									<div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
										{item.duration}
									</div>
								)}

								{/* PLAY BUTTON - NEW THEME */}
								<motion.div
									onClick={handlePlay}
									className="absolute bottom-4 right-4 size-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_10px_20px_rgba(192,38,211,0.4)] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20"
								>
									<Play className="size-6 text-white fill-white ml-1" />
								</motion.div>

								{/* SIDE ACTIONS ON HOVER */}
								<div className="absolute bottom-4 left-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 z-20">
									<button
										onClick={(e) => handleLike(e, item)}
										className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 hover:bg-pink-500 transition-colors"
									>
										<Heart
											className={cn(
												"size-4 transition-colors",
												isCurrentlyLiked
													? "fill-pink-500 text-pink-500"
													: "text-white",
											)}
										/>
									</button>
									<button
										onClick={(e) => handleMore(e, item)}
										className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-colors"
									>
										<MoreVertical className="size-4 text-white" />
									</button>
								</div>
							</div>

							{/* TEXT CONTENT */}
							<div
								className={cn(
									"space-y-1.5 px-1",
									variant === "circle" && "text-center",
								)}
							>
								<h3 className="text-white font-bold text-sm md:text-base truncate group-hover:text-pink-400 transition-colors">
									{item.title || item.name}
								</h3>
								<div className="flex items-center gap-2">
									<p className="text-zinc-400 text-xs font-medium truncate flex-1">
										{item.artist || item.role}
									</p>
									{item.plays && (
										<span className="text-[10px] text-zinc-600 font-bold whitespace-nowrap">
											• {item.plays}
										</span>
									)}
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
