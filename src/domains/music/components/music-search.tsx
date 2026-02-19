import { Music, Search, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "@/components/motion";
import { Input } from "@/components/ui/input";

interface SearchHeaderProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	title?: string;
}

export function MusicSearch({
	searchQuery,
	onSearchChange,
	title,
}: SearchHeaderProps) {
	const [isFocused, setIsFocused] = useState(false);

	// Updated for Music trends
	const trendingMusicSearches = [
		"The Weeknd",
		"After Hours",
		"Blinding Lights",
		"Synthwave Hits",
		"New Releases 2026",
	];

	return (
		<motion.div
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5"
		>
			<div className="py-4">
				<div className="flex items-center gap-6 justify-between">
					<div className="flex items-center gap-8 flex-1">
						<div className="relative flex-1 max-w-2xl">
							<div className="relative group">
								<Search
									className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused ? "text-pink-500" : "text-gray-500"}`}
								/>
								<Input
									value={searchQuery}
									onChange={(e) => onSearchChange(e.target.value)}
									onFocus={() => setIsFocused(true)}
									onBlur={() => setTimeout(() => setIsFocused(false), 200)}
									// Music-specific placeholder
									placeholder="Search for songs, artists, or albums..."
									className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-pink-500/10 rounded-full transition-all duration-300"
								/>
								{searchQuery && (
									<button
										type="button"
										onClick={() => onSearchChange("")}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
									>
										<X className="w-5 h-5" />
									</button>
								)}
							</div>

							{/* Music Suggestions Dropdown */}
							<AnimatePresence>
								{isFocused && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute top-full mt-3 left-0 right-0 bg-[#121212]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
									>
										<div className="flex items-center gap-2 mb-4">
											<TrendingUp className="w-4 h-4 text-pink-500" />
											<span className="text-xs font-bold uppercase tracking-widest text-gray-400">
												Trending Now
											</span>
										</div>
										<div className="grid grid-cols-1 gap-1">
											{trendingMusicSearches.map((search, index) => (
												<motion.button
													key={search}
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: index * 0.04 }}
													onClick={() => onSearchChange(search)}
													className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-pink-400 transition-all group"
												>
													<Music className="w-4 h-4 text-gray-600 group-hover:text-pink-500/50" />
													<span className="text-sm font-medium">{search}</span>
												</motion.button>
											))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>

					{/* Right Side Actions */}
					<div className="flex items-center gap-6">
						{title && (
							<h2 className="hidden lg:block text-xl font-black text-white tracking-tighter uppercase">
								{title}
							</h2>
						)}
						<div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 p-[2px] cursor-pointer hover:scale-110 transition-transform active:scale-95 shadow-lg shadow-purple-500/20">
							<div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
								<span className="text-white font-black text-xs">JD</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
