import { useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
	AppWindow,
	BadgeCheck,
	Crown,
	Gem,
	LayoutDashboard,
	Library,
	Link2Icon,
	Loader2,
	LogOut,
	Settings,
	Sparkles,
	Zap
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Image } from "@/components/ui/image.tsx";
import { ADMIN_ACCESS } from "@/constants/constants";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import type { Role } from "@/orpc/helpers/constants";
import { Route } from "@/routes/__root";
import { Link } from "../ui/link";
import { RoleBadge, SubscriptionBadge } from "./subscription-badge";
import { MenuItem } from "./user-menu-item";


export function UserMenu() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const { auth } = Route.useRouteContext();
	const user = auth?.user;

	const handleLogout = async () => {
		setIsLoading(true);
		await authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					toast.success("Logged out successfully");
					setIsLoading(false);
					await router.invalidate();
					router.navigate({ to: "/login" });
				},
				onError: () => {
					setIsLoading(false);
					toast.error("Failed to log out. Please try again.");
				}
			},
		});
	};

	const isAdmin = ADMIN_ACCESS.includes(user?.role as string)

	if (!user) return null;

	return (
		<div
			ref={ref}
			className="relative"
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
		>
			{/* AVATAR BUTTON */}
			<button className="group relative flex items-center gap-2 rounded-full p-1.5 transition-all hover:bg-white/5">
				<span className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

				<div className="relative size-10 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-indigo-400/60 transition-all">
					<Image
						src={user.image || `https://avatar.iran.liara.run/username?username=${user.name}`}
						alt={user.name}
						className="h-full w-full object-cover"
					/>

					{/* Status indicator */}
					{user.subscriptionStatus !== "FREE" && (
						<div className={cn(
							"absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-[#0b0b0c]",
							user.currentPlan?.includes("Family")
								? "bg-amber-500"
								: "bg-purple-500"
						)}>
							<div className={cn(
								"absolute inset-0 rounded-full animate-ping opacity-75",
								user.currentPlan?.includes("Family")
									? "bg-amber-400"
									: "bg-purple-400"
							)} />
						</div>
					)}
				</div>

				{/* Quick status badge on hover */}
				{user.currentPlan?.includes("Family") ? (
					<Crown className="size-4 text-amber-400 absolute -top-1 -right-1 drop-shadow-lg" />
				) : user.subscriptionStatus === "PREMIUM" && (
					<Zap className="size-4 text-purple-400 absolute -top-1 -right-1 drop-shadow-lg" />
				)}
			</button>

			{/* DROPDOWN */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: 8, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 8, scale: 0.98 }}
						className={cn(
							"absolute right-0 mt-2 w-72 overflow-hidden",
							"rounded-2xl border border-white/10",
							"bg-[#0b0b0c]/95 backdrop-blur-xl shadow-2xl",
						)}
					>
						{/* USER INFO HEADER */}
						<div className="relative px-4 pt-5 pb-4 bg-linear-to-br from-white/5 to-transparent">
							<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

							<div className="flex items-start gap-3">
								{/* Avatar */}
								<div className="relative size-16 rounded-full overflow-hidden ring-2 ring-white/20 shadow-xl">
									<Image
										src={user.image || `https://avatar.iran.liara.run/username?username=${user.name}`}
										alt={user.name}
										className="h-full w-full object-cover"
									/>
								</div>

								{/* User details */}
								<div className="flex-1 min-w-0">
									<p className="text-base font-semibold text-white truncate">
										{user.name}
									</p>
									<p className="text-xs text-slate-400 truncate mb-2">
										{user.email}
									</p>

									{/* Badges */}
									<div className="flex flex-wrap gap-1.5 mt-1">
										<RoleBadge role={user.role as string} />
										<SubscriptionBadge
											status={user.subscriptionStatus}
											currentPlan={user.currentPlan}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* QUICK STATS - Optional: Show subscription benefits */}
						{user.subscriptionStatus !== "FREE" && (
							<div className="px-4 py-3 border-t border-white/5 bg-white/2">
								<div className="flex items-center justify-between text-xs">
									<span className="text-slate-400">Plan benefits</span>
									<Link
										to="/library/subscription"
										className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
									>
										Manage →
									</Link>
								</div>
								<div className="grid grid-cols-2 gap-2 mt-2">
									<div className="flex items-center gap-1.5 text-xs text-slate-300">
										<BadgeCheck className="size-3.5 text-indigo-400" />
										<span>HD Streaming</span>
									</div>
									<div className="flex items-center gap-1.5 text-xs text-slate-300">
										<BadgeCheck className="size-3.5 text-indigo-400" />
										<span>No Ads</span>
									</div>
									{user.subscriptionStatus === "PREMIUM" && (
										<>
											<div className="flex items-center gap-1.5 text-xs text-slate-300">
												<Gem className="size-3.5 text-yellow-400" />
												<span>4K + HDR</span>
											</div>
											<div className="flex items-center gap-1.5 text-xs text-slate-300">
												<Gem className="size-3.5 text-yellow-400" />
												<span>Dolby Atmos</span>
											</div>
										</>
									)}
								</div>
							</div>
						)}

						{/* ACTIONS */}
						<div className="p-2 space-y-0.5">
							<MenuItem
								to="/library"
								icon={Library}
								label="Library"
								description="Your saved content"
							/>
							<MenuItem
								to="/library/setting"
								icon={Settings}
								label="Settings"
								description="Account preferences"
							/>

							<MenuItem
								to="/pricing"
								icon={Sparkles}
								label={user.subscriptionStatus === "FREE" ? "Upgrade Plan" : "Manage Subscription"}
								description={user.subscriptionStatus === "FREE" ? "Get premium features" : "Change your plan"}
								highlight={user.subscriptionStatus === "FREE"}
							/>
							{isAdmin && (
								<MenuItem
									to="/dashboard"
									icon={LayoutDashboard}
									label="Admin Dashboard"
									description="Access system overview"
								/>
							)}
							{ADMIN_ACCESS.includes(user.role as Role) && (
								<MenuItem
									to="/api/$"
									icon={Link2Icon}
									label={"APIs Page"}
									description={"Manage API system"}
									onClick={() => {
										window.location.href = "/api";
									}}

								/>
							)}
						</div>
						{/* LOGOUT */}
						<div className="border-t border-white/5 p-2">
							<motion.button
								whileHover={{ x: 4 }}
								whileTap={{ scale: 0.95 }}
								disabled={isLoading}
								onClick={handleLogout}
								className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50 group"
							>
								<div className="relative">
									{isLoading ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<LogOut className="size-4 group-hover:scale-110 transition-transform" />
									)}
								</div>
								<div className="flex-1 text-left">
									<p className="font-medium">
										{isLoading ? "Logging out..." : "Logout"}
									</p>
									<p className="text-xs text-red-400/60">
										Sign out of your account
									</p>
								</div>
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

