import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import {
	Home,
	Library,
	ListFilter,
	Minimize2,
	Plus,
	Search,
	X,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	type ActiveFilter,
	createPlaylist,
	musicStore,
	setFilter,
	setSearchQuery,
	toggleSidebar,
} from "@/domains/music/music.store";
import { AddToPlaylistModal } from "../components/add-playlist";
import { CreatePlaylistDialog } from "../components/create-playlist";
import { NavItem } from "./artists/components/side-nav-item";
import { SidebarItem } from "./artists/components/sidebar-item";

export function Sidebar() {
	const {
		library,
		searchQuery,
		activeFilter,
		isSidebarCollapsed,
		isAddModalOpen,
	} = useStore(musicStore);

	const [isSearching, setIsSearching] = useState(false);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

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
				<header className="pt-3 px-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-10">
					{/* Library Header Row */}
					<div
						className={`flex items-center text-gray-400 mb-2 ${
							isSidebarCollapsed ? "justify-center" : "justify-between"
						}`}
					>
						<button
							type="button"
							onClick={() => toggleSidebar()}
							className="flex items-center gap-3 hover:text-white transition-colors font-bold p-2 rounded-lg hover:bg-white/5"
						>
							<Library className="w-6 h-6 shrink-0" />
							{!isSidebarCollapsed && (
								<motion.span
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="whitespace-nowrap"
								>
									Your Library
								</motion.span>
							)}
						</button>

						{/* Removed opacity-0 and group-hover classes so these are ALWAYS visible */}
						{!isSidebarCollapsed && (
							<div className="flex items-center gap-1 transition-opacity">
								<button
									type="button"
									onClick={() => setIsCreateOpen(true)}
									className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
								>
									<Plus className="w-5 h-5" />
								</button>
								<button
									type="button"
									onClick={() => toggleSidebar()}
									className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
									title="Collapse"
								>
									<Minimize2 className="w-5 h-5" />
								</button>
							</div>
						)}
					</div>
					{/* Filters & Search - Hidden when collapsed */}
					{!isSidebarCollapsed && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="space-y-3"
						>
							<div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar">
								{(["All", "Playlists", "Artists"] as ActiveFilter[]).map(
									(f) => (
										<button
											type="button"
											key={f}
											onClick={() => setFilter(f)}
											className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
												activeFilter === f
													? "bg-white text-black"
													: "bg-[#2a2a2a] text-white hover:bg-[#333]"
											}`}
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
												className="bg-transparent text-xs text-white outline-none w-full"
												placeholder="Search in Your Library"
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
											/>
											<X
												className="w-3.5 h-3.5 cursor-pointer hover:text-white"
												onClick={() => {
													setIsSearching(false);
													setSearchQuery("");
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
										<span>Recents</span>
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
				onCreatePlaylist={(data) => createPlaylist(data.name, data.description)}
			/>

			<AddToPlaylistModal
				isOpen={isAddModalOpen}
				onClose={() =>
					musicStore.setState((s) => ({ ...s, isAddModalOpen: false }))
				}
				playlists={library.filter((i) => i.type === "playlist")}
				onAddToPlaylist={(id) => {
					console.log(`Added to ${id}`);
					musicStore.setState((s) => ({ ...s, isAddModalOpen: false }));
				}}
				onCreateNew={() => {
					musicStore.setState((s) => ({ ...s, isAddModalOpen: false }));
					setIsCreateOpen(true);
				}}
			/>
		</div>
	);
}
