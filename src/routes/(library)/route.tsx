import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { MiniPlayer } from "@/components/mini-music-player.tsx";
import { LibraryAppSidebar } from "@/domains/library/layouts/library-app-sidebar.tsx";
import { LibraryMobileNav } from "@/domains/library/layouts/library-mobile-nav.tsx";
import { LibraryTopBar } from "@/domains/library/layouts/library-top-bar.tsx";
import { useLibraryStore } from "@/domains/library/store/library-store.ts";
import { cn } from "@/lib/utils.ts";

export const Route = createFileRoute("/(library)")({
	component: LibraryLayout,
});

function LibraryLayout() {
	const location = useLocation();
	const sidebarOpen = useLibraryStore((state) => state.sidebarOpen);

	const hasCurrentMedia = useLibraryStore(
		(state) =>
			state.player.currentTrack !== null ||
			state.player.currentPodcast !== null,
	);

	/**
	 * CALCULATION LOGIC:
	 * Sidebar width is 280px (open) or 88px (closed).
	 * We add 16px (the 'left-4' fixed position of your sidebar).
	 * We add 24px for a nice visual gap between sidebar and content.
	 */
	const sidebarWidth = sidebarOpen ? 280 : 88;
	const sidebarLeftOffset = 16;
	const gap = 24;
	const totalOffset = sidebarWidth + sidebarLeftOffset + gap;

	return (
		<div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
			{/* 1. Desktop Sidebar */}
			<div className="hidden md:block">
				<LibraryAppSidebar />
			</div>

			{/* 2. Main Content Area */}
			<motion.main
				initial={false}
				animate={{
					paddingLeft: `${totalOffset}px`,
				}}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className={cn(
					"min-h-screen flex flex-col",
					"pb-24 md:pb-8",
					hasCurrentMedia && "pb-48 md:pb-40", // Space for the floating player
				)}
			>
				{/* Top Bar */}
				<div className="sticky top-0 z-30 bg-background/50 backdrop-blur-md pt-4">
					<LibraryTopBar />
				</div>

				{/* Page Content */}
				<div className="px-4 md:px-8 lg:px-12 pt-6">
					<AnimatePresence mode="wait">
						<motion.div
							key={location.pathname}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							<Outlet />
						</motion.div>
					</AnimatePresence>
				</div>
			</motion.main>

			{/* 3. Floating MiniPlayer Wrapper */}
			<AnimatePresence>
				{hasCurrentMedia && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1,
							// On desktop, we pad the left side so the player 
							// starts exactly where the main content starts.
							paddingLeft: `${totalOffset}px`,
						}}
						exit={{ y: 100, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						// fixed + left-0 + right-0 makes the wrapper full width
						className="fixed bottom-0 md:bottom-8 left-0 right-0 z-40 px-4 md:pr-8 pointer-events-none"
					>
						{/* pointer-events-auto restores clickability to the player itself */}
						<div className="pointer-events-auto w-full max-w-7xl mx-auto">
							<MiniPlayer />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* 4. Mobile Nav */}
			<div className="md:hidden">
				<LibraryMobileNav />
			</div>
		</div>
	);
}