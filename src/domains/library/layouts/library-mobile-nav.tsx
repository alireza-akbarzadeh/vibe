import { useLocation } from "@tanstack/react-router";
import { Film, Home, Mic2, Music, User } from "lucide-react";
import { motion } from "@/components/motion";

import { Link } from "@/components/ui/link.tsx";
import type { LibraryNav } from "@/domains/library/library-types.ts";
import { cn } from "@/lib/utils";

const navItems: LibraryNav[] = [
	{ icon: Home, label: "Home", href: "/library" },
	{ icon: Music, label: "Music", href: "/library/music" },
	{ icon: Film, label: "Videos", href: "/library/videos" },
	{ icon: Mic2, label: "Podcasts", href: "/library/podcast" },
	{ icon: User, label: "Profile", href: "/library/profile" },
];

export const LibraryMobileNav = () => {
	const location = useLocation();

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
			<div className="flex items-center justify-around h-16 px-2">
				{navItems.map((item) => {
					const isActive = location.pathname === item.href;
					const Icon = item.icon;

					return (
						<Link key={item.href} to={item.href} className="flex-1">
							<motion.div
								whileTap={{ scale: 0.9 }}
								className="flex flex-col items-center gap-1 py-2"
							>
								<div className="relative">
									<Icon
										className={cn(
											"w-5 h-5 transition-colors",
											isActive ? "text-primary" : "text-muted-foreground",
										)}
									/>
									{isActive && (
										<motion.div
											layoutId="mobileNavIndicator"
											className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
										/>
									)}
								</div>
								<span
									className={cn(
										"text-[10px] font-medium transition-colors",
										isActive ? "text-primary" : "text-muted-foreground",
									)}
								>
									{item.label}
								</span>
							</motion.div>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};
