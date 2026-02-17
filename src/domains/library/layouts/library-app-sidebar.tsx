import { LayoutGroup, motion } from "framer-motion";
import {
	Bookmark,
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Clock,
	CreditCard,
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
} from "lucide-react";
import React from "react";
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
import { LibraryPinnedItem } from "@/domains/library/components/library-sidebar/library-pinned-item.tsx";
import { LibraryProgress } from "@/domains/library/components/library-sidebar/library-progress.tsx";
import { LibraryRecent } from "@/domains/library/components/library-sidebar/library-recents.tsx";
import type { LibraryNav } from "@/domains/library/library-types.ts";
import { libraryActions } from "@/domains/library/store/library-actions.ts";
import { useLibraryStore } from "@/domains/library/store/library-store.ts";
import type { Track } from "@/domains/library/store/library-store-types";
import { useSession } from "@/integrations/auth/auth-client.ts";
import { cn } from "@/lib/utils";
import { LibraryMoodSelector } from "../components/library-sidebar/library-mood-selector";
import { LibrarySidebarNowPlaying } from "../components/library-sidebar/library-sidebar-mow-playing";
import { SidebarSearchTrigger } from "../components/library-sidebar/sidebar-search-trigger";


interface Mood {
	label: string;
	color: string;
}

interface PinnedTrack extends Track {
	color: string;
}


const mainNavItems: LibraryNav[] = [
	{ icon: Home, label: "Home", href: "/" },
	{ icon: Search, label: "Search", href: "/library/search" },
	{ icon: Library, label: "Library", href: "/library" },
	{ icon: Settings, label: "Setting", href: "/library/setting" },
	{ icon: CreditCard, label: "Subscription", href: "/library/subscription" },
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
	{ icon: User2, label: "Me", href: "/library/profile" },
];

export const moods: Mood[] = [
	{ label: "Focus", color: "bg-blue-500" },
	{ label: "Energetic", color: "bg-orange-500" },
	{ label: "Relax", color: "bg-emerald-500" }
];

const pinnedItems: PinnedTrack[] = [
	{
		id: "track_chill_01",
		title: "Chill Study",
		artist: "Vibe Records",
		color: "bg-emerald-500",
		cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=100",
		album: "Lofi Vibes",
		duration: 180,
		genre: "Lofi"
	},
	{
		id: "track_game_01",
		title: "Gaming",
		artist: "Synthwave",
		color: "bg-rose-500",
		cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100",
		album: "Cyberdrive",
		duration: 210,
		genre: "Synthwave"
	},
	{
		id: "track_focus_01",
		title: "Deep Focus",
		artist: "Alpha Waves",
		color: "bg-purple-500",
		cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100",
		album: "Brain Food",
		duration: 300,
		genre: "Ambient"
	}
];





export const LibraryAppSidebar = () => {
	const isOpen = useLibraryStore((state) => state.sidebarOpen);
	const { data: session } = useSession();
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
				animate={{ width: isOpen ? 280 : 88 }}
				className="fixed left-4 top-4 bottom-4 z-40 flex flex-col group/sidebar"
			>
				<div className="relative h-full w-full bg-zinc-950/90 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden">
					<LayoutGroup>
						<div className={cn("p-7 flex items-center", isOpen ? "justify-between" : "justify-center")}>
							<Link to="/" className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
									<Sparkles className="w-5 h-5 text-white" />
								</div>
								{isOpen && (
									<motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black text-2xl tracking-tighter italic">
										VIBE
									</motion.span>
								)}
							</Link>
						</div>

						<SidebarSearchTrigger isOpen={isOpen} onClick={() => setOpen(true)} />

						<nav className="flex-1 overflow-y-auto px-4 no-scrollbar space-y-6">
							<div className="space-y-1">
								{mainNavItems.map((item) => <LibraryNavLink key={item.href} item={item} />)}
							</div>

							<div className="pt-2">
								{isOpen && <p className="px-4 text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] mb-3">Pinned</p>}
								<div className="space-y-1">
									{pinnedItems.map((item) => (
										<LibraryPinnedItem
											key={item.id}
											isOpen={isOpen}
											label={item.title}
											color={item.color}
											itemData={item}
										/>
									))}
								</div>
							</div>

							<LibraryMoodSelector isOpen={isOpen} />

							<div className="pt-2">
								{isOpen && <p className="px-4 text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] mb-3">Discover</p>}
								<div className="space-y-1">
									{mediaNavItems.map((item) => <LibraryNavLink key={item.href} item={item} />)}
								</div>
							</div>

							<div className="pt-2">
								{isOpen && <p className="px-4 text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] mb-3">Library</p>}
								<div className="space-y-1">
									{userNavItems.map((item) => <LibraryNavLink key={item.href} item={item} />)}
								</div>
							</div>

							<div className="pt-4 border-t border-white/5">
								<LibraryRecent isOpen={isOpen} />
							</div>
						</nav>

						<div className="mt-auto space-y-4 pb-6 bg-linear-to-t from-zinc-950 to-transparent pt-6">
							{isOpen && (
								<div className="px-6 flex items-center gap-2">
									<div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/10">
										<div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
										<span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Cloud Synced</span>
									</div>
								</div>
							)}

							{isOpen && <LibraryProgress />}

							<div className="px-4">
								<Link to="/library/profile" className={cn("flex items-center gap-3 p-3 rounded-[1.5rem] bg-white/3 border border-white/5 hover:bg-white/10 transition-all", !isOpen && "justify-center")}>
									<div className="relative shrink-0">
										<img src={user?.image || "https://avatar.vercel.sh/user"} className="w-8 h-8 rounded-full ring-2 ring-primary/20" alt="Avatar" />
										<div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
									</div>
									{isOpen && (
										<div className="min-w-0">
											<p className="text-xs font-bold truncate">{user?.name || "Guest"}</p>
											<p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Library Pro</p>
										</div>
									)}
								</Link>
								<LibrarySidebarNowPlaying isOpen={isOpen} />
							</div>
						</div>
					</LayoutGroup>

					<button
						onClick={() => libraryActions.toggleSidebar()}
						className="absolute right-0 top-12 w-4 h-12 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-l-lg flex items-center justify-center opacity-0 group-hover/sidebar:opacity-100 transition-all border-l border-white/10"
					>
						{isOpen ? <ChevronLeft className="w-3 h-3 text-white" /> : <ChevronRight className="w-3 h-3 text-white" />}
					</button>
				</div>
			</motion.aside>

			{/* --- SEARCH DIALOG --- */}
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search everything..." />
				<CommandList className="bg-zinc-950 text-white border-none">
					<CommandEmpty>No results found.</CommandEmpty>

					<CommandGroup heading="Navigation">
						{[...mainNavItems, ...mediaNavItems, ...userNavItems].map((item) => (
							<CommandItem
								key={item.href}
								onSelect={() => runCommand(() => { window.location.href = item.href; })}
								className="aria-selected:bg-white/5"
							>
								<item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
								<span>{item.label}</span>
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator className="bg-white/5" />

					<CommandGroup heading="Vibe Modes">
						{moods.map((mood) => (
							<CommandItem
								key={mood.label}
								onSelect={() => runCommand(() => {
									console.log(`Vibe: ${mood.label}`);
								})}
								className="aria-selected:bg-white/5 cursor-pointer"
							>
								<div className={cn("mr-2 w-2 h-2 rounded-full", mood.color)} />
								<span>{mood.label} Mode</span>
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator className="bg-white/5" />

					<CommandGroup heading="Pinned Vibes">
						{pinnedItems.map((item) => (
							<CommandItem
								key={item.id}
								onSelect={() => runCommand(() => { libraryActions.playTrack(item); })}
								className="aria-selected:bg-white/5"
							>
								<Sparkles className={cn("mr-2 h-4 w-4", item.color.replace('bg-', 'text-'))} />
								<span>{item.title}</span>
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator className="bg-white/5" />
					<CommandGroup heading="System">
						<CommandItem onSelect={() => runCommand(() => { libraryActions.toggleSidebar(); })}>
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