import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Menu } from "lucide-react"; // Added Menu icon
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
	const { currentSong, isPlaying, currentTime, isSidebarCollapsed } = useStore(musicStore);

	return (
		<div className="h-screen bg-black flex flex-col overflow-hidden">
			<div className="flex-1 flex overflow-hidden relative">

				{/* 1. Desktop Sidebar (Hidden on Mobile) */}
				<motion.div
					animate={{ width: isSidebarCollapsed ? 0 : 288 }}
					className="z-20 shrink-0 overflow-hidden border-r border-white/5 hidden md:flex"
				>
					<Sidebar />
				</motion.div>

				{/* 2. Mobile Sidebar Drawer (Visible only on Mobile) */}
				<div className="md:hidden absolute left-4 top-4 z-50">
					<Sheet>
						<SheetTrigger asChild>
							<button className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white shadow-xl active:scale-90 transition-transform">
								<Menu className="w-6 h-6" />
							</button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0 w-80 bg-black border-r border-white/10">
							{/* Force sidebar to show full content in drawer */}
							<Sidebar forceFull />
						</SheetContent>
					</Sheet>
				</div>

				{/* 3. Desktop Expand Button (Visible only when collapsed on desktop) */}
				<AnimatePresence>
					{isSidebarCollapsed && (
						<motion.button
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							onClick={() => toggleSidebar()}
							className="hidden md:flex absolute left-2 top-4 z-40 p-2 bg-[#121212] hover:bg-[#282828] text-gray-400 hover:text-white rounded-full shadow-2xl border border-white/10 transition-colors"
						>
							<Maximize2 className="w-5 h-5" />
						</motion.button>
					)}
				</AnimatePresence>

				{/* 4. Main Content Area */}
				<main className="flex-1 overflow-y-auto relative bg-[#0a0a0a]">
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