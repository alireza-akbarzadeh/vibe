import {
	Clock,
	Film,
	Heart,
	type LucideIcon,
	Sparkles,
	TrendingUp,
	Tv,
} from "lucide-react";
import { motion } from "@/components/motion";

import { setCategory, useMoviesStore } from "../store";

export type CategoryVariant =
	| "all"
	| "series"
	| "trending"
	| "recent"
	| "favorites"
	| "movies"
	| "animation"
	| "comedy"
	| "romantic"
	| "horror";

export type CategoriesType = {
	id: CategoryVariant;
	label: string;
	icon: LucideIcon;
};

export function CategoryNav() {
	const activeCategory = useMoviesStore((state) => state.activeCategory);

	const categories: CategoriesType[] = [
		{ id: "all", label: "All", icon: Sparkles },
		{ id: "movies", label: "Movies", icon: Film },
		{ id: "series", label: "Series", icon: Tv },
		{ id: "animation", label: "Animation", icon: Heart },
		{ id: "trending", label: "Trending", icon: TrendingUp },
		{ id: "recent", label: "Recent", icon: Clock },
		{ id: "favorites", label: "My List", icon: Heart },
	];
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3, duration: 0.6 }}
			className="relative"
		>
			<div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
				{categories.map((category, index) => (
					<motion.button
						key={category.id}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.4 + index * 0.05 }}
						onClick={() => setCategory(category.id)}
						className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
							activeCategory === category.id
								? "text-white"
								: "text-gray-400 hover:text-white"
						}`}
					>
						{/* Active background */}
						{activeCategory === category.id && (
							<motion.div
								layoutId="activeCategory"
								className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30"
								transition={{ type: "spring", stiffness: 300, damping: 30 }}
							/>
						)}

						{/* Inactive background */}
						{activeCategory !== category.id && (
							<div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl" />
						)}

						{/* Content */}
						<category.icon className="w-5 h-5 relative z-10" />
						<span className="relative z-10">{category.label}</span>
					</motion.button>
				))}
			</div>
		</motion.div>
	);
}
