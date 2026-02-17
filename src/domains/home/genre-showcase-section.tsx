import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Film, Flame, Headphones, Play, Star, Trophy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Typography } from "@/components/ui/typography";
import { useLazySection } from "@/hooks/useLazySection";
import type { MediaList } from "@/orpc/models/media.schema";
import {
	comedyQueryOptions,
	horrorQueryOptions,
	topIMDBQueryOptions,
	trendingQueryOptions,
} from "./home.queries";

const categories = [
	{
		id: "trending",
		label: "Trending",
		icon: Flame,
		color: "from-orange-500 to-red-500",
	},
	{
		id: "top-imdb",
		label: "Top IMDB",
		icon: Trophy,
		color: "from-yellow-500 to-orange-500",
	},
	{
		id: "horror",
		label: "Horror",
		icon: Film,
		color: "from-red-600 to-purple-600",
	},
	{
		id: "comedy",
		label: "Comedy",
		icon: Headphones,
		color: "from-green-500 to-emerald-500",
	},
] as const;

type CategoryId = (typeof categories)[number]["id"];

// ─── Genre Card ────────────────────────────────────────────────
function GenreMovieCard({ item, index }: { item: MediaList; index: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: index * 0.08, duration: 0.4 }}
			className="group relative"
		>
			<Link to="/movies/$movieId" params={{ movieId: item.id }}>
				<div className="relative aspect-2/3 rounded-2xl overflow-hidden">
					<Image
						src={item.thumbnail}
						alt={item.title}
						className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

					{/* Play button */}
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
						<div className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-2xl">
							<Play className="w-6 h-6 fill-current ml-0.5" />
						</div>
					</div>

					{/* Rating */}
					{item.rating && (
						<div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm">
							<Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
							<span className="text-xs text-white font-bold">
								{item.rating.toFixed(1)}
							</span>
						</div>
					)}

					{/* Info */}
					<div className="absolute bottom-0 left-0 right-0 p-3">
						<h3 className="text-white font-bold text-sm truncate mb-0.5">
							{item.title}
						</h3>
						<div className="flex items-center gap-2 text-gray-400 text-xs">
							<span>{item.releaseYear}</span>
							{item.genres.length > 0 && (
								<>
									<span>·</span>
									<span className="truncate">{item.genres[0].genre.name}</span>
								</>
							)}
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}

export default function GenreShowcaseSection() {
	const [activeCategory, setActiveCategory] = useState<CategoryId>("trending");
	const { ref: sectionRef, isVisible } = useLazySection("300px");

	// Only fetch the active tab's data (+ trending which is the default)
	const { data: trendingData } = useQuery(trendingQueryOptions(8, isVisible));
	const { data: topIMDBData } = useQuery(
		topIMDBQueryOptions(8, isVisible && activeCategory === "top-imdb"),
	);
	const { data: horrorData } = useQuery(
		horrorQueryOptions(8, isVisible && activeCategory === "horror"),
	);
	const { data: comedyData } = useQuery(
		comedyQueryOptions(8, isVisible && activeCategory === "comedy"),
	);

	const categoryData: Record<CategoryId, MediaList[]> = {
		trending: trendingData?.data?.items ?? [],
		"top-imdb": topIMDBData?.data?.items ?? [],
		horror: horrorData?.data?.items ?? [],
		comedy: comedyData?.data?.items ?? [],
	};

	const currentItems = categoryData[activeCategory];

	return (
		<section
			ref={sectionRef}
			className="relative py-28 bg-[#0a0a0a] overflow-hidden"
		>
			{/* Background */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-1/2 left-0 w-1/2 h-96 bg-purple-600/6 rounded-full blur-[120px] -translate-y-1/2" />
				<div className="absolute top-1/2 right-0 w-1/2 h-96 bg-cyan-600/6 rounded-full blur-[120px] -translate-y-1/2" />
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-6">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
					className="text-center mb-12"
				>
					<Typography.H2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						Explore by{" "}
						<span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
							Genre
						</span>
					</Typography.H2>
					<Typography.P className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
						Pick your vibe and dive into curated collections
					</Typography.P>

					{/* Category tabs */}
					<div className="flex flex-wrap justify-center gap-3">
						{categories.map((cat) => (
							<Button
								key={cat.id}
								variant="text"
								size="lg"
								onClick={() => setActiveCategory(cat.id)}
								className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
									activeCategory === cat.id
										? "text-white"
										: "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
								}`}
							>
								{activeCategory === cat.id && (
									<motion.div
										layoutId="genreCategoryBg"
										className={`absolute inset-0 rounded-full bg-linear-to-r ${cat.color}`}
										transition={{
											type: "spring",
											bounce: 0.2,
											duration: 0.6,
										}}
									/>
								)}
								<span className="relative z-10 flex items-center gap-2">
									<cat.icon className="w-4 h-4" />
									{cat.label}
								</span>
							</Button>
						))}
					</div>
				</motion.div>

				{/* Content grid */}
				<AnimatePresence mode="wait">
					<motion.div
						key={activeCategory}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.35 }}
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
					>
						{currentItems.length > 0
							? currentItems
									.slice(0, 8)
									.map((item, index) => (
										<GenreMovieCard key={item.id} item={item} index={index} />
									))
							: // Skeleton
								Array.from({ length: 8 }).map((_, i) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
										key={`skeleton-${i}`}
										className="aspect-2/3 rounded-2xl bg-white/5 animate-pulse"
									/>
								))}
					</motion.div>
				</AnimatePresence>

				{/* View all */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4 }}
					className="text-center mt-10"
				>
					<Link to="/movies">
						<Button
							variant="ghost"
							className="px-8 py-3 rounded-full text-white/70 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 font-medium transition-all"
						>
							View All Content →
						</Button>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
