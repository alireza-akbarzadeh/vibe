import { Link, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
	BadgeCheck,
	Circle,
	CircleDot,
	Crown,
	Gem,
	Library,
	Loader2,
	LogOut,
	Settings,
	Shield,
	ShieldCheck,
	Sparkles,
	User,
	Zap
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Image } from "@/components/ui/image.tsx";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/__root";

// Subscription badge component
const SubscriptionBadge = ({ status }: { status: string }) => {
	const badges = {
		FREE: {
			icon: CircleDot,
			label: "Free",
			color: "text-slate-400",
			bg: "bg-slate-500/10",
			border: "border-slate-500/20",
		},
		PRO: {
			icon: Zap,
			label: "Pro",
			color: "text-blue-400",
			bg: "bg-blue-500/10",
			border: "border-blue-500/20",
		},
		PREMIUM: {
			icon: Crown,
			label: "Premium",
			color: "text-yellow-400",
			bg: "bg-yellow-500/10",
			border: "border-yellow-500/20",
		},
		CANCELLED: {
			icon: Circle,
			label: "Cancelled",
			color: "text-red-400",
			bg: "bg-red-500/10",
			border: "border-red-500/20",
		},
	};

	const badge = badges[status as keyof typeof badges] || badges.FREE;
	const Icon = badge.icon;
	return (
		<div className={cn(
			"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
			badge.bg,
			badge.border,
			badge.color
		)}>
			<Icon className="size-3.5" />
			<span>{badge.label}</span>
		</div>
	);
};

// Role badge component
const RoleBadge = ({ role }: { role: string }) => {
	const badges = {
		ADMIN: {
			icon: ShieldCheck,
			label: "Admin",
			color: "text-purple-400",
			bg: "bg-purple-500/10",
			border: "border-purple-500/20",
		},
		MODERATOR: {
			icon: Shield,
			label: "Moderator",
			color: "text-cyan-400",
			bg: "bg-cyan-500/10",
			border: "border-cyan-500/20",
		},
		USER: {
			icon: User,
			label: "Member",
			color: "text-green-400",
			bg: "bg-green-500/10",
			border: "border-green-500/20",
		},
	};

	const badge = badges[role as keyof typeof badges] || badges.USER;
	const Icon = badge.icon;

	return (
		<div className={cn(
			"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
			badge.bg,
			badge.border,
			badge.color
		)}>
			<Icon className="size-3.5" />
			<span>{badge.label}</span>
		</div>
	);
};
function MenuItem({
	to,
	icon: Icon,
	label,
	description,
	highlight,
}: {
	to: string;
	icon: React.ElementType;
	label: string;
	description?: string;
	highlight?: boolean;
}) {
	return (
		<Link
			to={to}
			className={cn(
				"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all group",
				highlight
					? "bg-linear-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/20"
					: "text-slate-300 hover:bg-white/5",
			)}
		>
			<div className={cn(
				"rounded-lg p-1.5",
				highlight ? "bg-indigo-500/20" : "bg-white/5 group-hover:bg-white/10"
			)}>
				<Icon className="size-4" />
			</div>
			<div className="flex-1 text-left">
				<p className="font-medium">{label}</p>
				{description && (
					<p className="text-xs text-slate-500">{description}</p>
				)}
			</div>
		</Link>
	);
}
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
						<div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-emerald-500 border-2 border-[#0b0b0c]">
							<div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
						</div>
					)}
				</div>

				{/* Quick status badge on hover */}
				{user.subscriptionStatus === "PREMIUM" && (
					<Crown className="size-4 text-yellow-400 absolute -top-1 -right-1 drop-shadow-lg" />
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
						<div className="relative px-4 pt-5 pb-4 bg-gradient-to-br from-white/5 to-transparent">
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
										<SubscriptionBadge status={user.subscriptionStatus} />
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
								to="/settings"
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

