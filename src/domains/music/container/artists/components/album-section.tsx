import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef } from "react";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import type { Albums } from "../artist.domains";

export function AlbumsSection({ albums }: { albums: Albums[] }) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = direction === "left" ? -400 : 400;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6 }}
		>
			<div className="flex items-center justify-between mb-8">
				<div>
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
						Discography
					</h2>
					<p className="text-gray-400">All albums and singles</p>
				</div>

				{/* Navigation buttons */}
				<div className="hidden md:flex gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => scroll("left")}
						className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white"
					>
						<ChevronLeft className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => scroll("right")}
						className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white"
					>
						<ChevronRight className="w-5 h-5" />
					</Button>
				</div>
			</div>

			{/* Albums grid/carousel */}
			<div className="relative group">
				{/* Gradient fades */}
				<div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
				<div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
					style={{
						scrollbarWidth: "none",
						msOverflowStyle: "none",
					}}
				>
					{albums.map((album, index) => (
						<motion.div
							key={album.id}
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, duration: 0.4 }}
							className="relative flex-shrink-0 w-64 group/album cursor-pointer"
						>
							{/* Album cover */}
							<div className="relative mb-4 overflow-hidden rounded-2xl shadow-2xl">
								<motion.div
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.4 }}
									className="aspect-square"
								>
									<img
										src={album.cover}
										alt={album.title}
										className="w-full h-full object-cover"
									/>

									{/* Overlay on hover */}
									<motion.div
										initial={{ opacity: 0 }}
										whileHover={{ opacity: 1 }}
										className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
									>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/50"
										>
											<Play className="w-7 h-7 text-white fill-white ml-1" />
										</motion.button>
									</motion.div>
								</motion.div>

								{/* Glow effect on hover */}
								<motion.div
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 1 }}
									className="absolute inset-0 rounded-2xl"
									style={{
										boxShadow: "0 0 40px rgba(139, 92, 246, 0.5)",
									}}
								/>
							</div>

							{/* Album info */}
							<div>
								<h3 className="text-white font-bold text-lg mb-1 group-hover/album:text-purple-400 transition-colors truncate">
									{album.title}
								</h3>
								<div className="flex items-center gap-2 text-sm text-gray-400">
									<span>{album.year}</span>
									<span>•</span>
									<span>{album.type}</span>
									<span>•</span>
									<span>{album.tracks} tracks</span>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</motion.section>
	);
}
