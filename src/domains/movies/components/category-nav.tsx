import { motion } from "framer-motion";
import type { Categories, CategoriesType } from "../movies";

interface CategoryNavProps {
	activeCategory: Categories;
	onCategoryChange: (category: Categories) => void;
	categories: CategoriesType[];
}

export function CategoryNav(props: CategoryNavProps) {
	const { activeCategory, categories, onCategoryChange } = props;

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
						onClick={() => onCategoryChange(category.id)}
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
