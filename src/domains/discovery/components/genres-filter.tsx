import { Film, Grid3x3, Music, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "@/components/motion";

interface GenreFiltersProps {
	activeFilter: string;
	onFilterChange: (filterId: string) => void;
}

export function GenreFilters({
	activeFilter,
	onFilterChange,
}: GenreFiltersProps) {
	const filters = [
		{ id: "all", label: "All", icon: Grid3x3 },
		{ id: "recommended", label: "For You", icon: Sparkles },
		{ id: "trending", label: "Trending", icon: TrendingUp },
		{ id: "music", label: "Music", icon: Music },
		{ id: "movies", label: "Movies", icon: Film },
	];

	return (
		<div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
			{filters.map((filter, index) => (
				<motion.button
					key={filter.id}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: index * 0.05 }}
					onClick={() => onFilterChange(filter.id)}
					className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
						activeFilter === filter.id
							? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
							: "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
					}`}
				>
					<filter.icon className="w-4 h-4" />
					<span>{filter.label}</span>
				</motion.button>
			))}
		</div>
	);
}
