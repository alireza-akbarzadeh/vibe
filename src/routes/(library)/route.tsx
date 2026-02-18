import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { MiniPlayer } from "@/components/mini-music-player.tsx";
import { LibraryAppSidebar } from "@/domains/library/layouts/library-app-sidebar.tsx";
import { LibraryMobileNav } from "@/domains/library/layouts/library-mobile-nav.tsx";
import { LibraryTopBar } from "@/domains/library/layouts/library-top-bar.tsx";
import { useLibraryStore } from "@/domains/library/store/library-store.ts";
import { cn } from "@/lib/utils.ts";
import { authMiddleware } from "@/middleware/auth";


export const Route = createFileRoute("/(library)")({
	component: LibraryLayout,
	beforeLoad: ({ context, location }) => {
		if (!context.auth) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	server: {
		middleware: [authMiddleware],
	},
});

function LibraryLayout() {
	const sidebarOpen = useLibraryStore((state) => state.sidebarOpen);

	const hasCurrentMedia = useLibraryStore(
		(state) =>
			state.player.currentTrack !== null ||
			state.player.currentPodcast !== null,
	);

	const sidebarWidth = sidebarOpen ? 260 : 72;
	const sidebarLeftOffset = 12;
	const gap = 20;
	const totalOffset = sidebarWidth + sidebarLeftOffset + gap;

	return (
		<div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
			<div className="hidden md:block">
				<LibraryAppSidebar />
			</div>

			<motion.main
				initial={false}
				animate={{
					paddingLeft: `${totalOffset}px`,
				}}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className={cn(
					"min-h-screen flex flex-col",
					"pb-24 md:pb-8",
					hasCurrentMedia && "pb-48 md:pb-40",
				)}
			>
				<div className="sticky top-0 z-30 bg-background/50 backdrop-blur-md pt-4">
					<LibraryTopBar />
				</div>

				<div className="px-4 md:px-8 lg:px-12 pt-6">
					<Outlet />
				</div>
			</motion.main>

			<AnimatePresence>
				{hasCurrentMedia && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1,
							paddingLeft: `${totalOffset}px`,
						}}
						exit={{ y: 100, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="fixed bottom-0 md:bottom-8 left-0 right-0 z-40 px-4 md:pr-8 pointer-events-none"
					>
						<div className="pointer-events-auto w-full max-w-7xl mx-auto">
							<MiniPlayer />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="md:hidden">
				<LibraryMobileNav />
			</div>
		</div>
	);
}