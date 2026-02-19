import { useRouteContext } from "@tanstack/react-router";
import {
	Bookmark,
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Clock,
	Crown,
	Film,
	Heart,
	Home,
	Library,
	Mic2,
	Music,
	Search,
	Settings,
	Sparkles,
	User2,
	Zap,
} from "lucide-react";
import React from "react";
import { LayoutGroup, motion } from "@/components/motion";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { Link } from "@/components/ui/link.tsx";
import { LibraryNavLink } from "@/domains/library/components/library-sidebar/library-nav-link.tsx";
import type { LibraryNav } from "@/domains/library/library-types.ts";
import { libraryActions } from "@/domains/library/store/library-actions.ts";
import { useLibraryStore } from "@/domains/library/store/library-store.ts";
import { cn } from "@/lib/utils";
import { LibrarySidebarNowPlaying } from "../components/library-sidebar/library-sidebar-mow-playing";

const mainNavItems: LibraryNav[] = [
	{ icon: Home, label: "Home", href: "/" },
	{ icon: Search, label: "Search", href: "/library/search" },
	{ icon: Library, label: "Library", href: "/library" },
];

const mediaNavItems: LibraryNav[] = [
	{ icon: Music, label: "Music", href: "/library/music" },
	{ icon: Film, label: "Videos", href: "/library/videos" },
	{ icon: BookOpen, label: "Blogs", href: "/library/blogs" },
	{ icon: Mic2, label: "Podcasts", href: "/library/podcast" },
];

const userNavItems: LibraryNav[] = [
	{ icon: Heart, label: "Liked", href: "/library/liked" },
	{ icon: Bookmark, label: "Saved", href: "/library/saved" },
	{ icon: Clock, label: "History", href: "/library/history" },
	{ icon: User2, label: "Profile", href: "/library/profile" },
	{ icon: Settings, label: "Settings", href: "/library/setting" },
];

function SubscriptionBadge({
	status,
	isOpen,
}: {
	status?: string;
	isOpen: boolean;
}) {
	if (!isOpen) return null;

	const isPremium = status === "PREMIUM";
	const isFamily = status === "FAMILY";
	const isFree = !status || status === "FREE";

	return (
		<div
			className={cn(
				"mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit",
				isFree && "bg-zinc-800/60 text-zinc-500",
				isPremium &&
					"bg-purple-500/10 text-purple-400 border border-purple-500/20",
				isFamily && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
			)}
		>
			{isFree && <Sparkles className="w-2.5 h-2.5" />}
			{isPremium && <Zap className="w-2.5 h-2.5" />}
			{isFamily && <Crown className="w-2.5 h-2.5" />}
			<span>{isFree ? "Free" : isPremium ? "Premium" : "Family"}</span>
		</div>
	);
}

export const LibraryAppSidebar = () => {
	const isOpen = useLibraryStore((state) => state.sidebarOpen);
	const { auth: session } = useRouteContext({ from: "__root__" });
	const user = session?.user;

	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const runCommand = React.useCallback((command: () => void) => {
		setOpen(false);
		command();
	}, []);

	return (
		<>
			<motion.aside
				initial={false}
				animate={{ width: isOpen ? 260 : 72 }}
				className="fixed left-3 top-3 bottom-3 z-40 flex flex-col group/sidebar"
			>
				<div className="relative h-full w-full bg-zinc-950/95 backdrop-blur-2xl border border-white/6 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
					<LayoutGroup>
						{/* Logo */}
						<div
							className={cn(
								"px-5 pt-5 pb-3 flex items-center",
								isOpen ? "justify-between" : "justify-center",
							)}
						>
							<Link to="/" className="flex items-center gap-2.5">
								<div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_16px_rgba(var(--primary),0.25)]">
									<Sparkles className="w-4.5 h-4.5 text-white" />
								</div>
								{isOpen && (
									<motion.span
										initial={{ opacity: 0, x: -8 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -8 }}
										className="font-black text-lg tracking-tight"
									>
										VIBE
									</motion.span>
								)}
							</Link>
						</div>

						{/* Search trigger */}
						<div className="px-3 mb-2">
							<button
								type="button"
								onClick={() => setOpen(true)}
								className={cn(
									"w-full flex items-center gap-2.5 rounded-xl transition-colors cursor-pointer",
									isOpen
										? "px-3 py-2 bg-white/4 hover:bg-white/6 text-muted-foreground/50 text-xs"
										: "justify-center py-2 hover:bg-white/5",
								)}
							>
								<Search className="w-4 h-4 shrink-0 text-muted-foreground/40" />
								{isOpen && (
									<>
										<span className="flex-1 text-left">Search…</span>
										<kbd className="text-[10px] text-muted-foreground/30 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
											⌘K
										</kbd>
									</>
								)}
							</button>
						</div>

						{/* Navigation */}
						<nav className="flex-1 overflow-y-auto px-3 no-scrollbar space-y-5">
							<div className="space-y-0.5">
								{mainNavItems.map((item) => (
									<LibraryNavLink key={item.href} item={item} />
								))}
							</div>

							<div>
								{isOpen && (
									<p className="px-3 text-[9px] font-bold text-muted-foreground/25 uppercase tracking-[0.3em] mb-2">
										Discover
									</p>
								)}
								<div className="space-y-0.5">
									{mediaNavItems.map((item) => (
										<LibraryNavLink key={item.href} item={item} />
									))}
								</div>
							</div>

							<div>
								{isOpen && (
									<p className="px-3 text-[9px] font-bold text-muted-foreground/25 uppercase tracking-[0.3em] mb-2">
										Library
									</p>
								)}
								<div className="space-y-0.5">
									{userNavItems.map((item) => (
										<LibraryNavLink key={item.href} item={item} />
									))}
								</div>
							</div>
						</nav>

						{/* Footer */}
						<div className="mt-auto border-t border-white/5 p-3 space-y-3">
							<LibrarySidebarNowPlaying isOpen={isOpen} />

							{/* User card */}
							<Link
								to="/library/profile"
								className={cn(
									"flex items-center gap-2.5 p-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-all",
									!isOpen && "justify-center p-2",
								)}
							>
								<div className="relative shrink-0">
									<img
										src={
											user?.image ||
											`https://avatar.vercel.sh/${user?.email || "u"}`
										}
										className="w-8 h-8 rounded-full ring-1 ring-white/10 object-cover"
										alt="Avatar"
									/>
									<div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border-[1.5px] border-zinc-950 rounded-full" />
								</div>
								{isOpen && (
									<div className="min-w-0 flex-1">
										<p className="text-xs font-semibold truncate leading-tight">
											{user?.name || "Guest"}
										</p>
										<SubscriptionBadge
											status={user?.subscriptionStatus}
											isOpen={isOpen}
										/>
									</div>
								)}
							</Link>
						</div>
					</LayoutGroup>

					{/* Toggle button */}
					<button
						type="button"
						onClick={() => libraryActions.toggleSidebar()}
						className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-10 bg-white/5 hover:bg-white/10 rounded-l-md flex items-center justify-center opacity-0 group-hover/sidebar:opacity-100 transition-all cursor-pointer"
					>
						{isOpen ? (
							<ChevronLeft className="w-3 h-3 text-white/60" />
						) : (
							<ChevronRight className="w-3 h-3 text-white/60" />
						)}
					</button>
				</div>
			</motion.aside>

			{/* Search Dialog */}
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search everything..." />
				<CommandList className="bg-zinc-950 text-white border-none">
					<CommandEmpty>No results found.</CommandEmpty>

					<CommandGroup heading="Navigation">
						{[...mainNavItems, ...mediaNavItems, ...userNavItems].map(
							(item) => (
								<CommandItem
									key={item.href}
									onSelect={() =>
										runCommand(() => {
											window.location.href = item.href;
										})
									}
									className="aria-selected:bg-white/5"
								>
									<item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
									<span>{item.label}</span>
								</CommandItem>
							),
						)}
					</CommandGroup>

					<CommandSeparator className="bg-white/5" />

					<CommandGroup heading="System">
						<CommandItem
							onSelect={() =>
								runCommand(() => {
									libraryActions.toggleSidebar();
								})
							}
						>
							<ChevronLeft className="mr-2 h-4 w-4 text-muted-foreground" />
							<span>Toggle Sidebar</span>
							<CommandShortcut>⌘B</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
};
