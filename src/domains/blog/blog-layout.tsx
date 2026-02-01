import { Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronRight,
	Compass,
	Film,
	Flame,
	Heart,
	Menu,
	Music,
	Play,
	Search,
	Sparkles,
	User,
	X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { MSG } from "@/constants/constants";
import { actions, blogStore } from "@/domains/blog/store/blog.store";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CommandSetting } from "./components/command-setting";
import { LibraryButton } from "./components/library-item";

export const CATEGORIES = [
	{ id: "all", label: "Feed", icon: Compass },
	{ id: "music", label: "Music", icon: Music },
	{ id: "movies", label: "Cinema", icon: Film },
	{ id: "artists", label: "Artists", icon: User },
	{ id: "behind", label: "Originals", icon: Play },
];

export function BlogLayout({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const activeCategory = useStore(blogStore, (s) => s.activeCategory);
	const bookmarks = useStore(blogStore, (s) => s.bookmarks);
	const likes = useStore(blogStore, (s) => s.likes);

	const { isMobile, isTablet } = useMediaQuery();
	const isSmallScreen = isMobile || isTablet;

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
			<CommandSetting setOpen={setOpen} open={open} />

			{/* MOBILE HEADER */}
			{isSmallScreen && (
				<header className="sticky top-0 w-full h-16 bg-[#080808]/80 backdrop-blur-2xl border-b border-white/5 z-60 px-4 flex items-center justify-between">
					<Logo />
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400"
						>
							<Search size={18} />
						</button>
						<button
							type="button"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="p-2 rounded-xl bg-purple-600 text-white"
						>
							{isMenuOpen ? <X size={18} /> : <Menu size={18} />}
						</button>
					</div>
				</header>
			)}

			{/* SIDEBAR / DRAWER */}
			<aside
				className={`
                ${isSmallScreen
						? `fixed inset-0 z-55 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 bg-[#050505]`
						: "w-72 border-r border-white/5 sticky top-0 h-screen"
					} 
                flex flex-col bg-[#080808]/80 backdrop-blur-2xl
            `}
			>
				<div className="p-8 hidden lg:block">
					<Logo />
				</div>

				<div className="flex-1 overflow-y-auto px-4 mt-20 lg:mt-0 custom-scrollbar">
					{!isSmallScreen && (
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="w-full mb-8 flex items-center justify-between px-4 py-3 rounded-2xl bg-white/3 border border-white/5 text-neutral-500 hover:bg-white/5"
						>
							<div className="flex items-center gap-3 text-white/60">
								<Search size={16} />
								<span className="text-sm font-medium">Quick search...</span>
							</div>
							<kbd className="text-[10px] font-bold bg-black px-1.5 py-0.5 rounded border border-white/10">
								⌘K
							</kbd>
						</button>
					)}

					{/* Navigation Groups */}
					<div className="mb-8">
						<h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-4">
							Discover
						</h2>
						<nav className="space-y-1">
							{CATEGORIES.map((cat) => {
								const isActive = activeCategory === cat.id;
								return (
									<button
										type="button"
										key={cat.id}
										onClick={() => {
											actions.setActiveCategory(cat.id);
											if (isSmallScreen) setIsMenuOpen(false);
										}}
										className={`w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative ${isActive ? "text-white font-bold" : "text-neutral-500"}`}
									>
										{isActive && (
											<motion.div
												layoutId="active-pill"
												className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl"
											/>
										)}
										<cat.icon
											size={18}
											className={`relative z-10 ${isActive ? "text-purple-400" : ""}`}
										/>
										<span className="text-sm relative z-10">{cat.label}</span>
									</button>
								);
							})}
						</nav>
					</div>

					<div className="mb-8">
						<h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-4">
							Collection
						</h2>
						<div className="space-y-1">
							<LibraryButton
								icon={Heart}
								label="Liked"
								count={likes.length}
								color="text-pink-500"
								active={activeCategory === "likes"}
								onClick={() => {
									actions.setActiveCategory("likes");
									if (isSmallScreen) setIsMenuOpen(false);
								}}
							/>
							<LibraryButton
								icon={Sparkles}
								label="Saved"
								count={bookmarks.length}
								color="text-yellow-400"
								active={activeCategory === "bookmarks"}
								onClick={() => {
									actions.setActiveCategory("bookmarks");
									if (isSmallScreen) setIsMenuOpen(false);
								}}
							/>
						</div>
					</div>

					<div className="mb-8 p-4 rounded-3xl bg-linear-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-white">
						<div className="flex items-center gap-2 mb-3">
							<Flame size={14} className="text-orange-500" />
							<span className="text-[10px] font-black uppercase tracking-widest">
								Daily Streak
							</span>
						</div>
						<div className="flex gap-1.5 mb-3">
							{[1, 1, 1, 1, 0, 0, 0].map((active, i) => (
								<div
									key={i + active}
									className={`h-1 flex-1 rounded-full ${active ? "bg-orange-500" : "bg-white/10"}`}
								/>
							))}
						</div>
						<p className="text-[10px] text-neutral-400 font-medium italic">
							4 days streak! Keep it up.
						</p>
					</div>
				</div>

				{/* UPDATED: Profile Link in Sidebar */}
				<div className="p-4 border-t border-white/5 mt-auto">
					<Link
						to="/blog/profile"
						onClick={() => isSmallScreen && setIsMenuOpen(false)}
						className="block hover:bg-white/5 rounded-2xl p-1 transition-colors"
					>
						<div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group outline-none">
							<div className="relative">
								<img
									alt="user"
									src="https://i.pravatar.cc/100?u=me"
									className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5 group-hover:ring-purple-500/50 transition-all"
								/>
								<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-bold truncate">Alex Rivera</p>
								<p className="text-[10px] text-purple-400 font-black uppercase tracking-wider">
									Pro Member
								</p>
							</div>
							<ChevronRight
								size={16}
								className="text-neutral-600 group-hover:text-white transition-all group-data-[state=open]:rotate-180"
							/>
						</div>
					</Link>
				</div>
			</aside>

			{/* MOBILE BOTTOM NAV - Quick Access */}
			<AnimatePresence>
				{isSmallScreen && !isMenuOpen && (
					<motion.nav
						initial={{ y: 100, x: "-50%", opacity: 0 }}
						animate={{ y: 0, x: "-50%", opacity: 1 }}
						exit={{ y: 100, x: "-50%", opacity: 0 }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed bottom-6 left-1/2 flex items-center bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl px-4 py-2 z-45 shadow-2xl scale-110 gap-2"
					>
						{CATEGORIES.slice(0, 4).map((cat) => (
							<button
								type="button"
								key={cat.id}
								onClick={() => actions.setActiveCategory(cat.id)}
								className={`p-3 transition-colors ${activeCategory === cat.id ? "text-purple-500" : "text-neutral-500"}`}
							>
								<cat.icon size={20} />
							</button>
						))}

						{/* Separator */}
						<div className="w-px h-6 bg-white/10 mx-1" />

						{/* UPDATED: Profile Icon in Floating Dock */}
						<Link
							to="/blog/profile"
							className="p-3 text-neutral-500 hover:text-white transition-colors"
						>
							<div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
								<img
									src="https://i.pravatar.cc/100?u=alireza"
									className="w-full h-full object-cover"
									alt="p"
								/>
							</div>
						</Link>
					</motion.nav>
				)}
			</AnimatePresence>

			<main
				className={`flex-1 ${isSmallScreen ? "min-h-[calc(100vh-64px)]" : "h-screen overflow-y-auto"}`}
			>
				{children}
				{isSmallScreen && <div className="h-28" />}
			</main>
		</div>
	);
}
