import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { ContinueWatching } from "@/types/app";
import { MovieCard } from "./movie-card";

export type MovieVariantCard =
	| "large"
	| "featured"
	| "standard"
	| "personalized";

interface MovieCarouselProps {
	title: string;
	subtitle?: string;
	showProgress?: boolean;
	variant: MovieVariantCard;
	movies: ContinueWatching[];
}
export function MovieCarousel({
	title,
	subtitle,
	movies,
	showProgress,
	variant = "standard",
}: MovieCarouselProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = direction === "left" ? -800 : 800;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6 }}
			className="relative max-w-450 mx-auto px-6"
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<h2 className="text-2xl md:text-3xl font-bold text-white">
							{title}
						</h2>
						{variant === "personalized" && (
							<motion.div
								animate={{ rotate: [0, 360] }}
								transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
							>
								<Sparkles className="w-5 h-5 text-purple-400" />
							</motion.div>
						)}
					</div>
					{subtitle && <p className="text-gray-400">{subtitle}</p>}
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

			{/* Carousel */}
			<div className="relative group">
				{/* Gradient fades */}
				<div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
				<div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

				{/* Movie cards container */}
				<div
					ref={scrollRef}
					className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
					style={{
						scrollbarWidth: "none",
						msOverflowStyle: "none",
					}}
				>
					{movies.map((movie, index) => (
						<MovieCard
							key={movie.id}
							movie={movie}
							index={index}
							showProgress={showProgress as boolean}
							variant={variant}
						/>
					))}
				</div>

				{/* Mobile navigation hint */}
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 0 }}
					transition={{ delay: 2, duration: 1 }}
					className="md:hidden absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500"
				>
					Swipe to see more
				</motion.div>
			</div>
		</motion.div>
	);
}
