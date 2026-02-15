import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { CastList } from "@/domains/movies/components";
import type { GroupedCast } from "@/orpc/models/cast.schema";

export type CastType = {
	name: string;
	character: string;
	image: string;
};

interface CastCarouselProps {
	cast?: GroupedCast;
}

export function CastCarousel({ cast }: CastCarouselProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	// Transform API cast data to component format
	const castList: CastType[] =
		cast?.actors.map((actor) => ({
			name: actor.person.name,
			character: actor.role || "Unknown",
			image: actor.person.profilePath
				? `https://image.tmdb.org/t/p/w200${actor.person.profilePath}`
				: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
		})) || [];

	// Show placeholder if no cast data
	if (!cast || castList.length === 0) {
		return (
			<section className="max-w-7xl mx-auto px-6 py-16">
				<h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
					Cast & Crew
				</h2>
				<p className="text-gray-400">No cast information available.</p>
			</section>
		);
	}

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = direction === "left" ? -400 : 400;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

return (
	<section className="relative py-20 bg-linear-to-b from-[#0d0d0d] to-[#0a0a0a] overflow-hidden">
		<div className="max-w-7xl mx-auto px-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8 }}
			>
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
							Cast & Crew
						</h2>
						<p className="text-gray-400">Starring</p>
					</div>

					<div className="hidden md:flex gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => scroll("left")}
							className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
						>
							<ChevronLeft className="w-5 h-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => scroll("right")}
							className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
						>
							<ChevronRight className="w-5 h-5" />
						</Button>
					</div>
				</div>

				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 snap-x snap-mandatory"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					{castList.map((actor, index) => (
						<CastList actor={actor} index={index} key={actor.name} />
					))}
				</div>
			</motion.div>
		</div>

		{/* Gradient fade edges */}
		<div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-[#0d0d0d] to-transparent pointer-events-none" />
		<div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
	</section>
);
}
