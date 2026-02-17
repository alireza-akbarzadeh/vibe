import { useLocation, useNavigate, useRouteContext } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	Bell,
	ChevronLeft,
	ChevronRight,
	Command,
	Search,
} from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { UserMenu } from "@/components/user-menui/user-menu";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
	"/library": "Library",
	"/library/music": "Music",
	"/library/videos": "Videos",
	"/library/blogs": "Blogs",
	"/library/podcast": "Podcasts",
	"/library/liked": "Liked",
	"/library/saved": "Watchlist",
	"/library/history": "History",
	"/library/profile": "Profile",
	"/library/setting": "Settings",
	"/library/search": "Search",
	"/library/subscription": "Subscription",
};

export const LibraryTopBar = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { auth } = useRouteContext({ from: "__root__" });
	const [searchFocused, setSearchFocused] = useState(false);
	const searchRef = useRef<HTMLInputElement>(null);

	const crumb = breadcrumbMap[pathname] ?? "Library";
	const isRoot = pathname === "/library";
	const user = auth?.user;

	const greeting = (() => {
		const h = new Date().getHours();
		if (h < 12) return "Good morning";
		if (h < 18) return "Good afternoon";
		return "Good evening";
	})();

	return (
		<header className="h-16 flex items-center justify-between gap-4 px-4 md:px-8 lg:px-12">
			{/* Left: Nav + Breadcrumb */}
			<div className="flex items-center gap-3 min-w-0">
				<div className="flex items-center gap-1">
					<button
						onClick={() => window.history.back()}
						className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>
					<button
						onClick={() => window.history.forward()}
						className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>

				<div className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
					{!isRoot && (
						<>
							<Link
								to="/library"
								className="text-muted-foreground/50 hover:text-muted-foreground transition-colors text-xs font-medium"
							>
								Library
							</Link>
							<span className="text-muted-foreground/30">/</span>
						</>
					)}
					<span className="text-foreground font-semibold text-xs truncate">
						{isRoot ? `${greeting}, ${user?.name?.split(" ")[0] ?? "there"}` : crumb}
					</span>
				</div>
			</div>

			{/* Center: Search */}
			<div className="flex-1 max-w-md mx-4 hidden md:block">
				<motion.div
					animate={{ scale: searchFocused ? 1.02 : 1 }}
					transition={{ type: "spring", stiffness: 400, damping: 30 }}
					className="relative"
				>
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
					<Input
						ref={searchRef}
						placeholder="Search your library..."
						onFocus={() => setSearchFocused(true)}
						onBlur={() => setSearchFocused(false)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								const q = (e.target as HTMLInputElement).value.trim();
								if (q) navigate({ to: "/library/search", search: { q } });
							}
						}}
						className={cn(
							"pl-10 pr-20 h-9 bg-white/5 border-transparent rounded-full text-sm",
							"placeholder:text-muted-foreground/40",
							"focus:bg-white/8 focus:border-white/10 focus:ring-0 transition-all",
						)}
					/>
					<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground/30">
						<kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-medium">
							<Command className="w-2.5 h-2.5" />K
						</kbd>
					</div>
				</motion.div>
			</div>

			{/* Right: Actions */}
			<div className="flex items-center gap-2">
				{/* Mobile search */}
				<button
					onClick={() => navigate({ to: "/library/search" })}
					className="md:hidden w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground cursor-pointer"
				>
					<Search className="w-4 h-4" />
				</button>

				{/* Notifications */}
				<button className="relative w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
					<Bell className="w-4 h-4" />
					<span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
				</button>

				{/* User avatar / menu */}
				{user && <UserMenu />}
			</div>
		</header>
	);
};
