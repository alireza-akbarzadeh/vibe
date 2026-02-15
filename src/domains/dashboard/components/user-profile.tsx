import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LogOut, Settings, ShieldCheck, UserCircle } from "lucide-react";
import { Route as RootRoute } from "@/routes/__root";
import { authClient } from "@/lib/auth/auth-client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserProfileProps {
	variant?: "sidebar" | "header";
	isCollapsed?: boolean; // Only used for sidebar
}

export function UserProfile({ variant = "sidebar", isCollapsed = false }: UserProfileProps) {
	const isHeader = variant === "header";

	// Get real user data from auth context
	const { auth } = RootRoute.useRouteContext();
	const user = auth?.user;

	// Fallback values if no user is logged in
	const avatarSeed = user?.email || "Guest";
	const userName = user?.name || "Guest User";
	const userEmail = user?.email || "guest@vibe.app";
	const userRole = user?.role || "USER";
	const userId = user?.id || "GUEST";

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/login";
				},
			},
		});
	};

	return (
		<div className={cn(
			"transition-all duration-300",
			isHeader ? "flex items-center" : (isCollapsed ? "p-2" : "p-4")
		)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className={cn(
						"flex items-center rounded-xl transition-all duration-200 outline-none group border border-transparent",
						isHeader
							? "p-0.5 hover:opacity-80" // Minimal style for header
							: "w-full p-2 gap-3 hover:bg-accent/50 hover:border-border/50",
						!isHeader && isCollapsed && "justify-center px-0"
					)}>
						{/* Avatar Section */}
						<div className="relative shrink-0">
							<img
								alt={userName}
								src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
								className={cn(
									"rounded-lg object-cover shadow-sm ring-1 ring-border group-hover:ring-primary/50 transition-all",
									isHeader ? "w-8 h-8" : "w-9 h-9"
								)}
							/>
							{/* Animated Status Indicator */}
							<div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center">
								<motion.div
									initial={{ scale: 0.8, opacity: 0.5 }}
									animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
									transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
									className="absolute w-2.5 h-2.5 bg-emerald-500 rounded-full"
								/>
								<div className="relative w-2.5 h-2.5 bg-emerald-500 border-2 border-card rounded-full z-10" />
							</div>
						</div>

						{/* Name and Role - ONLY for Sidebar (and only if not collapsed) */}
						{!isHeader && (
							<AnimatePresence mode="wait">
								{!isCollapsed && (
									<motion.div
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -10 }}
										className="flex flex-1 flex-col items-start min-w-0"
									>
										<p className="text-sm font-semibold text-foreground truncate w-full text-left leading-none mb-1">
											{userName}
										</p>
										<div className="flex items-center gap-1.5">
											<ShieldCheck className="w-3 h-3 text-indigo-500" />
											<p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
												{userRole}
											</p>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						)}

						{/* Chevron - ONLY for Sidebar (and only if not collapsed) */}
						{!isHeader && !isCollapsed && (
							<ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground group-data-[state=open]:rotate-90 transition-all" />
						)}
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					className="w-64 rounded-2xl p-2 shadow-xl border-border/50 bg-popover/95 backdrop-blur-md"
					// Side logic: Header drops down, Sidebar drops up/right
					side={isHeader ? "bottom" : (isCollapsed ? "right" : "top")}
					align={isHeader ? "end" : "center"}
					sideOffset={12}
				>
					<DropdownMenuLabel className="p-3">
						<div className="flex flex-col gap-1">
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-tighter">User ID: {userId.slice(0, 12)}</p>
							<p className="text-sm font-semibold truncate text-foreground">{userEmail}</p>
						</div>
					</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<div className="p-1 space-y-0.5">
						<DropdownMenuItem className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary group">
							<UserCircle size={16} className="text-muted-foreground group-focus:text-primary" />
							<div className="flex flex-col">
								<span className="text-sm font-medium">My Profile</span>
								<span className="text-[10px] text-muted-foreground">Work & Personal details</span>
							</div>
						</DropdownMenuItem>

						<DropdownMenuItem className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary group">
							<Settings size={16} className="text-muted-foreground group-focus:text-primary" />
							<div className="flex flex-col">
								<span className="text-sm font-medium">Preferences</span>
								<span className="text-[10px] text-muted-foreground">Theme & System settings</span>
							</div>
						</DropdownMenuItem>
					</div>

					<DropdownMenuSeparator />

					<div className="p-1">
						<DropdownMenuItem
							onClick={handleSignOut}
							className="flex items-center gap-3 p-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
						>
							<LogOut size={16} />
							<span className="font-medium text-sm">Sign out</span>
						</DropdownMenuItem>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}