import { useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "@/components/motion";
import { Link } from "@/components/ui/link";
import { useLibraryStore } from "@/domains/library/store/library-store.ts";
import { cn } from "@/lib/utils.ts";
import type { LibraryNav } from "../../library-types";

export const LibraryNavLink = ({ item }: { item: LibraryNav }) => {
	const { pathname } = useLocation();
	const isOpen = useLibraryStore((state) => state.sidebarOpen);

	const isActive =
		item.href === "/" || item.href === "/library"
			? pathname === item.href
			: pathname.startsWith(item.href);

	const Icon = item.icon;

	return (
		<Link to={item.href} className="relative block px-2">
			<motion.div
				whileHover={{ x: isOpen ? 2 : 0 }}
				whileTap={{ scale: 0.98 }}
				className={cn(
					"relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 ease-out",
					isActive
						? "text-foreground"
						: "text-muted-foreground/50 hover:text-muted-foreground/90",
				)}
			>
				<AnimatePresence>
					{isActive && (
						<motion.div
							layoutId="nav-pill"
							className="absolute inset-0 z-0 rounded-xl bg-linear-to-b from-white/8 to-transparent border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md"
							transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
						/>
					)}
				</AnimatePresence>

				{isActive && (
					<motion.div
						layoutId="active-laser"
						className="absolute left-0 w-0.75 h-5 bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.8)]"
					/>
				)}

				<div className="relative z-10 flex items-center justify-center">
					<Icon
						className={cn(
							"w-5 h-5 shrink-0 transition-all duration-300",
							isActive
								? "text-primary stroke-[2px] drop-shadow-[0_0_10px_rgba(var(--primary),0.4)]"
								: "group-hover:scale-110",
						)}
					/>
				</div>

				<AnimatePresence mode="popLayout">
					{isOpen && (
						<motion.span
							initial={{ opacity: 0, x: -8 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -8 }}
							className={cn(
								"relative z-10 font-medium tracking-tight text-[13.5px]",
								isActive ? "font-bold" : "",
							)}
						>
							{item.label}
						</motion.span>
					)}
				</AnimatePresence>
			</motion.div>
		</Link>
	);
};
