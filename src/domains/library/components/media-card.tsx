import { Play } from "lucide-react";
import { motion } from "@/components/motion";
import { fadeInUp } from "@/components/motion/motion-page";

export function MediaCard({
	item,
	aspect = "portrait",
}: {
	item: {
		id: string;
		title: string;
		thumbnail: string;
		type: string;
		duration?: number;
	};
	aspect?: "portrait" | "video";
}) {
	return (
		<motion.div
			variants={fadeInUp}
			whileHover={{ y: -5 }}
			className="group cursor-pointer relative"
		>
			<div
				className={`relative overflow-hidden rounded-2xl bg-zinc-900 ${aspect === "video" ? "aspect-video" : "aspect-[2/3]"}`}
			>
				<img
					src={item.thumbnail || "/api/placeholder/400/600"}
					alt={item.title}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
					<div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl">
						<Play className="w-6 h-6" fill="currentColor" />
					</div>
				</div>
				<div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
					<span className="text-[9px] font-black uppercase tracking-widest text-white/80">
						{item.type}
					</span>
				</div>
				<div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
					<p className="font-bold text-sm tracking-tight truncate">
						{item.title}
					</p>
					{item.duration && (
						<p className="text-xs text-white/70 mt-1">{item.duration} min</p>
					)}
				</div>
			</div>
			<div className="mt-3 px-1">
				<p className="font-bold text-sm tracking-tight truncate text-foreground group-hover:text-primary transition-colors">
					{item.title}
				</p>
			</div>
		</motion.div>
	);
}
