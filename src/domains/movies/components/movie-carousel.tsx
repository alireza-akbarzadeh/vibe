import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { MediaList } from "@/orpc/models/media.schema";
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
	movies: MediaList[];
	sectionSlug?: string;
}

export function MovieCarousel({
	title,
	subtitle,
	movies,
	showProgress,
	variant = "standard",
	sectionSlug,
}: MovieCarouselProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const checkScroll = useCallback(() => {
		if (scrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
			setCanScrollLeft(scrollLeft > 20);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
		}
	}, []);

	useEffect(() => {
		checkScroll();
		window.addEventListener("resize", checkScroll);
		return () => window.removeEventListener("resize", checkScroll);
	}, [checkScroll]);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const { clientWidth } = scrollRef.current;
			const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
			className="relative w-full max-w-450 mx-auto mb-16"
		>
			{/* Cinematic Header */}
			<div className="px-8 md:px-12 mb-8 flex items-end justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						{variant === "personalized" && (
							<div className="p-1.5 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
								<Sparkles className="w-4 h-4 text-purple-400" />
							</div>
						)}
						<h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
							{title}
						</h2>
					</div>
					{subtitle && (
						<p className="text-gray-400 font-medium tracking-tight max-w-xl">
							{subtitle}
						</p>
					)}
				</div>

				<div className="flex items-center gap-6">
					{sectionSlug && (
						<Link
							to="/explore/$section"
							params={{ section: sectionSlug }}
							className="group flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors"
						>
							VIEW ALL
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					)}

					{/* Desktop Navigation */}
					<div className="hidden md:flex gap-2">
						<Button
							variant="ghost"
							size="icon"
							disabled={!canScrollLeft}
							onClick={() => scroll("left")}
							className="rounded-full w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 disabled:opacity-0 transition-all"
						>
							<ChevronLeft className="w-6 h-6" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							disabled={!canScrollRight}
							onClick={() => scroll("right")}
							className="rounded-full w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 disabled:opacity-0 transition-all"
						>
							<ChevronRight className="w-6 h-6" />
						</Button>
					</div>
				</div>
			</div>

			{/* Carousel Container */}
			<div className="relative group/carousel">
				{/* Refined Edge Gradients */}
				<div
					className={`absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#050505] via-[#050505]/50 to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
				/>
				<div
					className={`absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#050505] via-[#050505]/50 to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollRight ? "opacity-100" : "opacity-0"}`}
				/>

				{/* Cards Container */}
				<div
					ref={scrollRef}
					onScroll={checkScroll}
					className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-8 md:px-12 pb-12"
					style={{
						scrollbarWidth: "none",
						msOverflowStyle: "none",
						maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
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

					{/* Explore More Card */}
					{sectionSlug && (
						<Link
							to="/explore/$section"
							params={{ section: sectionSlug }}
							className="shrink-0 group/more"
						>
							<div className="w-45 h-full flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-500">
								<div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover/more:scale-110 group-hover/more:bg-purple-500 transition-all">
									<ArrowRight className="w-6 h-6 text-white" />
								</div>
								<span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover/more:text-white transition-colors">
									Explore More
								</span>
							</div>
						</Link>
					)}
				</div>

				{/* Mobile Navigation Hint */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
				>
					<div className="w-8 h-1 rounded-full bg-white/20 overflow-hidden">
						<motion.div
							className="h-full bg-purple-500"
							animate={{ x: ["-100%", "100%"] }}
							transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
						/>
					</div>
					<span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
						Swipe
					</span>
				</motion.div>
			</div>
		</motion.div>
	);
}
