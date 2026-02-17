import { motion } from "framer-motion";
import { Bookmark, Headphones, Heart, Mic2, Play } from "lucide-react";
import { scaleIn } from "@/components/motion/motion-page.tsx";
import { cn } from "@/lib/utils";



interface MediaCardProps {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	type: "track" | "video" | "blog" | "podcast";
	aspectRatio?: "square" | "video" | "portrait";
	onPlay?: () => void;
	showPlayButton?: boolean;
	meta?: string;
	className?: string;
}

export const MediaCard = ({
	id,
	title,
	subtitle,
	image,
	type,
	onPlay,
	showPlayButton = true,
	meta,
	className,
}: MediaCardProps) => {
	const isPodcast = type === "podcast";
	const finalAspectRatio = isPodcast ? "aspect-[4/5]" : "aspect-square";

	return (
		<motion.div
			variants={scaleIn}
			whileHover="hover"
			className={cn("group relative w-full", className)}
		>
			{/* Main Visual Wrapper */}
			<div className="relative z-10">
				<div className={cn(
					"relative overflow-hidden rounded-[2rem] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)] group-hover:-translate-y-3",
					finalAspectRatio
				)}>
					{/* The Image */}
					<img
						src={image || "/api/placeholder/400/400"}
						alt={title}
						className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
						loading="lazy"
					/>

					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

					{/* Top Action Bar */}
					<div className="absolute top-4 inset-x-4 flex justify-between items-start">
						<div className="bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white/90 uppercase tracking-widest">
							{type}
						</div>

						<div className="flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
							<button
								onClick={(e) => { e.stopPropagation(); }}
								className="p-2.5 rounded-full backdrop-blur-xl border border-white/10 bg-black/40 text-white/70 hover:bg-white/20 transition-all active:scale-90"
							>
								<Heart className="size-4" />
							</button>
						</div>
					</div>

					{/* Minimalist Play Reveal */}
					{showPlayButton && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<motion.div
								variants={{
									initial: { opacity: 0, scale: 0.5 },
									hover: { opacity: 1, scale: 1 }
								}}
								transition={{ type: "spring", stiffness: 260, damping: 20 }}
								className="size-20 rounded-full bg-primary flex items-center justify-center text-black shadow-2xl pointer-events-auto cursor-pointer"
								onClick={(e) => { e.stopPropagation(); onPlay?.(); }}
							>
								<Play className="size-8 fill-current ml-1" />
							</motion.div>
						</div>
					)}

					{/* Meta Info & Bookmark (Bottom) */}
					<div className="absolute bottom-5 inset-x-5 flex justify-between items-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
						{meta ? (
							<span className="text-[11px] font-bold text-white/70 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
								{meta}
							</span>
						) : <div />}

						<button
							onClick={(e) => { e.stopPropagation(); }}
							className="p-2 rounded-full backdrop-blur-md text-white/50 hover:text-white transition-colors"
						>
							<Bookmark className="size-4" />
						</button>
					</div>
				</div>
			</div>

			{/* Typography */}
			<div className="mt-5 px-1 space-y-1">
				<h3 className="font-bold text-white text-base md:text-lg tracking-tight truncate group-hover:text-primary transition-colors">
					{title}
				</h3>
				<p className="text-sm font-semibold text-white/30 group-hover:text-white/50 transition-colors">
					{subtitle}
				</p>
			</div>
		</motion.div>
	);
};