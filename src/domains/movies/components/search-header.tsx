import { AnimatePresence, motion } from "framer-motion";
import { Search, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/storybook";
import { Input } from "@/components/ui/input";

interface SearchHeaderProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export function SearchHeader({
	searchQuery,
	onSearchChange,
}: SearchHeaderProps) {
	const [isFocused, setIsFocused] = useState(false);

	const trendingSearches = [
		"Dune Part Two",
		"Oppenheimer",
		"The Last of Us",
		"Breaking Bad",
		"Christopher Nolan",
	];

	return (
		<motion.div
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5"
		>
			<div className="max-w-450 mx-auto px-6 py-4">
				<div className="flex items-center gap-4">
					{/* Logo */}
					<Logo />

					{/* Search bar */}
					<div className="relative flex-1 max-w-2xl">
						<div className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
							<Input
								value={searchQuery}
								onChange={(e) => onSearchChange(e.target.value)}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setTimeout(() => setIsFocused(false), 200)}
								placeholder="Search movies, series, or actors..."
								className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all"
							/>
							{searchQuery && (
								<Button
									onClick={() => onSearchChange("")}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
								>
									<X className="w-5 h-5" />
								</Button>
							)}
						</div>

						{/* Search suggestions dropdown */}
						<AnimatePresence>
							{isFocused && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="absolute top-full mt-2 left-0 right-0 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
								>
									<div className="flex items-center gap-2 mb-3">
										<TrendingUp className="w-4 h-4 text-purple-400" />
										<span className="text-sm font-semibold text-white">
											Trending Searches
										</span>
									</div>
									<div className="space-y-2">
										{trendingSearches.map((search, index) => (
											<motion.button
												key={search}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.05 }}
												onClick={() => onSearchChange(search)}
												className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
											>
												{search}
											</motion.button>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* User menu placeholder */}
					<div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
						<span className="text-white font-bold text-sm">JD</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
