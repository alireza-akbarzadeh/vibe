import { useStore } from "@tanstack/react-store";
import {
	Home,
	Library,
	ListFilter,
	Minimize2,
	Plus,
	Search,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { AnimatePresence, motion } from "@/components/motion";
import { Input } from "@/components/ui/input";
import {
	type ActiveFilter,
	musicAction,
	musicStore,
} from "@/domains/music/music.store";
import { cn } from "@/lib/utils";
import { AddToPlaylistModal } from "../components/add-playlist";
import { CreatePlaylistDialog } from "../components/create-playlist";
import { NavItem } from "./artists/components/side-nav-item";
import { SidebarItem } from "./artists/components/sidebar-item";

interface SidebarProps {
	forceFull?: boolean;
}

export function Sidebar({ forceFull = false }: SidebarProps) {
	const {
		library,
		searchQuery,
		activeFilter,
		isSidebarCollapsed: storeCollapsed,
	} = useStore(musicStore);

	// If inside a Mobile Drawer, we never want it collapsed
	const isSidebarCollapsed = forceFull ? false : storeCollapsed;

	const [isSearching, setIsSearching] = useState(false);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	// Load library data from API on mount
	useEffect(() => {
		musicAction.loadLibrary();
	}, []);

	const filteredLibrary = library.filter((item) => {
		const matchesSearch = item.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesFilter =
			activeFilter === "All" ||
			(activeFilter === "Playlists" && item.type === "playlist") ||
			(activeFilter === "Artists" && item.type === "artist");
		return matchesSearch && matchesFilter;
	});

	return (
		<div className="flex flex-col h-full gap-2 p-2 select-none w-full bg-black">
			{/* Top Navigation Group */}
			<nav className="bg-[#121212] rounded-xl p-2 space-y-1">
				<div
					className={cn(
						"mb-2 transition-all duration-300",
						isSidebarCollapsed
							? "opacity-0 h-0 overflow-hidden"
							: "opacity-100 p-2",
					)}
				>
					<Logo />
				</div>

				<NavItem
					icon={Home}
					label="Home"
					to="/music"
					isCollapsed={isSidebarCollapsed}
				/>
				<NavItem
					icon={Search}
					label="Search"
					to="/music/search"
					isCollapsed={isSidebarCollapsed}
				/>
			</nav>

			{/* Library Group */}
			<div className="bg-[#121212] rounded-xl flex-1 flex flex-col overflow-hidden">
				<header className="pt-3 px-4 z-10">
					{/* Library Header Row */}
					<div
						className={cn(
							"flex items-center text-gray-400 mb-2 transition-all",
							isSidebarCollapsed ? "justify-center" : "justify-between",
						)}
					>
						<button
							type="button"
							onClick={() => !forceFull && musicAction.toggleSidebar()}
							className="flex items-center gap-3 hover:text-white transition-colors font-bold p-2 rounded-lg hover:bg-white/5"
						>
							<Library className="w-6 h-6 shrink-0" />
							{!isSidebarCollapsed && (
								<motion.span
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									className="whitespace-nowrap"
								>
									Your Library
								</motion.span>
							)}
						</button>

						{/* Only show these if NOT collapsed and NOT in a forced mobile view */}
						{!isSidebarCollapsed && (
							<div className="flex items-center gap-1">
								<AddToPlaylistModal
									trigger={
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												musicAction.toggleAddToPlayListModal();
											}}
											className="p-1.5  hover:bg-white/10  text-gray-400 hover:text-white transition-colors"
										>
											<Plus className="w-6 h-7" />
										</button>
									}
								/>
								{/* Hide collapse toggle in mobile drawer */}
								{!forceFull && (
									<button
										type="button"
										onClick={() => musicAction.toggleSidebar()}
										className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
									>
										<Minimize2 className="w-5 h-5" />
									</button>
								)}
							</div>
						)}
					</div>

					{/* Filters & Search - Hidden when collapsed */}
					{!isSidebarCollapsed && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							className="space-y-3 overflow-hidden"
						>
							<div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar">
								{(["All", "Playlists", "Artists"] as ActiveFilter[]).map(
									(f) => (
										<button
											type="button"
											key={f}
											onClick={() => musicAction.setFilter(f)}
											className={cn(
												"text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all",
												activeFilter === f
													? "bg-white text-black"
													: "bg-[#2a2a2a] text-white hover:bg-[#333]",
											)}
										>
											{f}
										</button>
									),
								)}
							</div>

							<div className="pb-2 flex items-center justify-between text-gray-400 min-h-10">
								<div className="flex items-center flex-1">
									{isSearching ? (
										<motion.div
											initial={{ width: 0, opacity: 0 }}
											animate={{ width: "100%", opacity: 1 }}
											className="relative flex items-center w-full bg-[#242424] rounded-md px-2 py-1.5 mr-2"
										>
											<Search className="w-3.5 h-3.5 mr-2" />
											<Input
												className="bg-transparent text-xs text-white outline-none w-full border-none h-auto p-0 focus-visible:ring-0"
												placeholder="Search in Your Library"
												autoFocus
												value={searchQuery}
												onChange={(e) =>
													musicAction.setSearchQuery(e.target.value)
												}
											/>
											<X
												className="w-3.5 h-3.5 cursor-pointer hover:text-white"
												onClick={() => {
													setIsSearching(false);
													musicAction.setSearchQuery("");
												}}
											/>
										</motion.div>
									) : (
										<button
											type="button"
											onClick={() => setIsSearching(true)}
											className="p-1.5 hover:bg-white/5 rounded-full transition-colors"
										>
											<Search className="w-4 h-4 hover:text-white" />
										</button>
									)}
								</div>
								{!isSearching && (
									<button
										type="button"
										className="flex items-center gap-1.5 text-xs font-medium hover:text-white transition-colors group"
									>
										<span className="hidden sm:inline">Recents</span>
										<ListFilter className="w-4 h-4" />
									</button>
								)}
							</div>
						</motion.div>
					)}
				</header>

				{/* Library List */}
				<div className="flex-1 overflow-y-auto px-2 pt-2 custom-scrollbar">
					<AnimatePresence mode="popLayout">
						{filteredLibrary.map((item) => (
							<SidebarItem
								key={item.id}
								item={item}
								onOpenCreate={() => setIsCreateOpen(true)}
							/>
						))}
					</AnimatePresence>
				</div>
			</div>
			{/* Modals */}
			<CreatePlaylistDialog
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>
		</div>
	);
}
