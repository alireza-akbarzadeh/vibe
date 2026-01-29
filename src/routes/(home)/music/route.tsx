import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Maximize2 } from "lucide-react";
import { BottomPlayer } from "@/domains/music/components/bottom-player";
import { Sidebar } from "@/domains/music/container/sidebar";
import {
	musicStore,
	togglePlay,
	toggleSidebar,
	updateCurrentTime,
} from "@/domains/music/music.store";
export const Route = createFileRoute("/(home)/music")({
	component: MusicLayout,
});

function MusicLayout() {
	const { currentSong, isPlaying, currentTime, isSidebarCollapsed } =
		useStore(musicStore);

	return (
		<div className="h-screen bg-black flex flex-col overflow-hidden">
			<div className="flex-1 flex overflow-hidden relative">
				{/* 1. The Sidebar Container */}
				<motion.div
					animate={{ width: isSidebarCollapsed ? 0 : 288 }} // Use 0 if you want it fully hidden
					className="z-20 shrink-0 overflow-hidden border-r border-white/5"
				>
					<Sidebar />
				</motion.div>

				{/* 2. The Expand Button (Only visible when collapsed) */}
				<AnimatePresence>
					{isSidebarCollapsed && (
						<motion.button
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							onClick={() => toggleSidebar()}
							className="absolute left-2 top-4 z-40 p-2 bg-[#121212] hover:bg-[#282828] text-gray-400 hover:text-white rounded-full shadow-2xl border border-white/10 transition-colors"
						>
							<Maximize2 className="w-5 h-5" />
						</motion.button>
					)}
				</AnimatePresence>

				{/* 3. Main Content Area */}
				<main
					className={`flex-1 overflow-y-auto relative bg-[#0a0a0a] transition-all duration-300 ${isSidebarCollapsed ? "pl-12" : ""}`}
				>
					<Outlet />
				</main>
			</div>
			{currentSong && (
				<div className="z-30">
					<BottomPlayer
						currentSong={currentSong}
						isPlaying={isPlaying}
						onPlayPause={togglePlay}
						currentTime={currentTime}
						onTimeChange={updateCurrentTime}
					/>
				</div>
			)}
		</div>
	);
}
