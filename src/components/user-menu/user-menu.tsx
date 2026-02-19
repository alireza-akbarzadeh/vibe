import { useRouter } from "@tanstack/react-router";
import type { User } from "better-auth";
import {
	BadgeCheck,
	ChevronRight,
	Crown,
	Gem,
	LayoutDashboard,
	Library,
	Link2Icon,
	Loader2,
	LogOut,
	Settings,
	Sparkles,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "@/components/motion";
import { Image } from "@/components/ui/image.tsx";
import { ADMIN_ACCESS } from "@/constants/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { authClient } from "@/lib/auth/auth-client";
import type { AuthSessionType } from "@/lib/auth/better-auth";
import { cn } from "@/lib/utils";
import type { Role } from "@/orpc/helpers/constants";
import { Route } from "@/routes/__root";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";
import { Link } from "../ui/link";
import { RoleBadge, SubscriptionBadge } from "./subscription-badge";

interface NavItem {
	to: string;
	icon: React.ElementType;
	label: string;
	desc?: string;
	highlight?: boolean;
	onClick?: () => void;
}

function UserAvatar({
	src,
	name,
	size = "md",
	subscriptionStatus,
	currentPlan,
}: {
	src: string;
	name: string;
	size?: "sm" | "md" | "lg";
	subscriptionStatus?: string;
	currentPlan?: string | null;
}) {
	const sizeMap = { sm: "size-9", md: "size-10", lg: "size-16" };
	const dotSize = size === "lg" ? "size-4" : "size-3.5";

	return (
		<div className="relative">
			<div
				className={cn(
					"rounded-full overflow-hidden ring-2 ring-white/10 transition-all",
					sizeMap[size],
				)}
			>
				<Image
					src={src || `https://avatar.iran.liara.run/username?username=${name}`}
					alt={name}
					className="h-full w-full object-cover"
				/>
			</div>
			{subscriptionStatus && subscriptionStatus !== "FREE" && (
				<div
					className={cn(
						"absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-[#0b0b0c]",
						dotSize,
						currentPlan?.includes("Family") ? "bg-amber-500" : "bg-purple-500",
					)}
				>
					<div
						className={cn(
							"absolute inset-0 rounded-full animate-ping opacity-75",
							currentPlan?.includes("Family")
								? "bg-amber-400"
								: "bg-purple-400",
						)}
					/>
				</div>
			)}
		</div>
	);
}

function useMenuItems(user: {
	role?: string | null;
	subscriptionStatus?: string;
}) {
	const isAdmin = ADMIN_ACCESS.includes(user?.role as string);

	const items: NavItem[] = [
		{
			to: "/library",
			icon: Library,
			label: "Library",
			desc: "Your saved content",
		},
		{
			to: "/library/setting",
			icon: Settings,
			label: "Settings",
			desc: "Account preferences",
		},
		{
			to: "/pricing",
			icon: Sparkles,
			label:
				user.subscriptionStatus === "FREE" ? "Upgrade Plan" : "Manage Plan",
			desc:
				user.subscriptionStatus === "FREE"
					? "Get premium features"
					: "Change your plan",
			highlight: user.subscriptionStatus === "FREE",
		},
	];

	if (isAdmin) {
		items.push({
			to: "/dashboard",
			icon: LayoutDashboard,
			label: "Dashboard",
			desc: "Admin overview",
		});
	}

	if (ADMIN_ACCESS.includes(user.role as Role)) {
		items.push({
			to: "/api/$",
			icon: Link2Icon,
			label: "APIs",
			desc: "Manage API system",
			onClick: () => {
				window.location.href = "/api";
			},
		});
	}

	return items;
}

function DesktopMenu({
	user,
	items,
	isLoading,
	onLogout,
}: {
	user: User;
	items: NavItem[];
	isLoading: boolean;
	onLogout: () => void;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const timeout = useRef<ReturnType<typeof setTimeout>>(null);

	const handleEnter = () => {
		if (timeout.current) {
			clearTimeout(timeout.current);
			timeout.current = undefined;
		}
		setOpen(true);
	};
	const handleLeave = () => {
		timeout.current = setTimeout(() => setOpen(false), 200);
	};

	useEffect(() => {
		return () => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}
		};
	}, []);
	if (!user) return null;
	return (
		<div
			ref={ref}
			className="relative"
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
		>
			{/* Trigger */}
			<button
				onClick={() => setOpen((o) => !o)}
				className="group relative flex items-center rounded-full p-1 transition-all hover:bg-white/5 cursor-pointer"
			>
				<span className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
				<UserAvatar
					src={user.image}
					name={user.name}
					subscriptionStatus={user.subscriptionStatus}
					currentPlan={user.currentPlan}
				/>
				{user.currentPlan?.includes("Family") ? (
					<Crown className="size-3.5 text-amber-400 absolute -top-0.5 -right-0.5 drop-shadow-lg" />
				) : (
					user.subscriptionStatus === "PREMIUM" && (
						<Zap className="size-3.5 text-purple-400 absolute -top-0.5 -right-0.5 drop-shadow-lg" />
					)
				)}
			</button>

			{/* Tooltip‑style dropdown with arrow */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: 6, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 6, scale: 0.97 }}
						transition={{
							type: "spring",
							stiffness: 500,
							damping: 30,
						}}
						className="absolute right-0 mt-3 w-75 z-50"
					>
						{/* Arrow */}
						<div className="absolute -top-1.5 right-5 w-3 h-3 rotate-45 bg-[#111113] border-l border-t border-white/10 z-10" />

						<div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#111113]/98 backdrop-blur-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.8)]">
							{/* User header */}
							<div className="relative px-4 pt-5 pb-4">
								<div className="absolute inset-0 bg-linear-to-br from-indigo-500/4 to-purple-500/2" />
								<div className="relative flex items-start gap-3">
									<UserAvatar
										src={user.image}
										name={user.name}
										size="lg"
										subscriptionStatus={user.subscriptionStatus}
										currentPlan={user.currentPlan}
									/>
									<div className="flex-1 min-w-0 pt-0.5">
										<p className="text-[15px] font-semibold text-white truncate leading-tight">
											{user.name}
										</p>
										<p className="text-xs text-white/40 truncate mt-0.5">
											{user.email}
										</p>
										<div className="flex flex-wrap gap-1.5 mt-2.5">
											<RoleBadge role={user.role as string} />
											<SubscriptionBadge
												status={user.subscriptionStatus}
												currentPlan={user.currentPlan}
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Benefits row */}
							{user.subscriptionStatus !== "FREE" && (
								<div className="mx-3 mb-2 px-3 py-2.5 rounded-xl bg-white/3 border border-white/4">
									<div className="flex items-center justify-between mb-2">
										<span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
											Benefits
										</span>
										<Link
											to="/library/subscription"
											className="text-[10px] font-semibold text-indigo-400/80 hover:text-indigo-300 transition-colors"
										>
											Manage →
										</Link>
									</div>
									<div className="grid grid-cols-2 gap-1.5">
										{[
											{ label: "HD Streaming", always: true },
											{ label: "Ad-free", always: true },
											{ label: "4K + HDR", premium: true },
											{ label: "Dolby Atmos", premium: true },
										]
											.filter(
												(b) =>
													b.always ||
													(b.premium && user.subscriptionStatus === "PREMIUM"),
											)
											.map((b) => (
												<div
													key={b.label}
													className="flex items-center gap-1.5 text-[11px] text-white/50"
												>
													{b.premium ? (
														<Gem className="size-3 text-amber-400/70" />
													) : (
														<BadgeCheck className="size-3 text-indigo-400/70" />
													)}
													<span>{b.label}</span>
												</div>
											))}
									</div>
								</div>
							)}

							{/* Nav items */}
							<div className="p-1.5 space-y-0.5">
								{items.map((item) => {
									const Icon = item.icon;
									return (
										<Link
											key={item.to}
											to={item.to}
											onClick={(e) => {
												if (item.onClick) {
													e.preventDefault();
													item.onClick();
												}
												setOpen(false);
											}}
											className={cn(
												"flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-all group/item",
												item.highlight
													? "bg-linear-to-r from-indigo-500/10 to-purple-500/10 text-indigo-300 hover:from-indigo-500/20 hover:to-purple-500/20"
													: "text-white/70 hover:bg-white/4 hover:text-white",
											)}
										>
											<div
												className={cn(
													"rounded-lg p-1.5 transition-colors",
													item.highlight
														? "bg-indigo-500/20"
														: "bg-white/4 group-hover/item:bg-white/8",
												)}
											>
												<Icon className="size-3.5" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium leading-tight">
													{item.label}
												</p>
												{item.desc && (
													<p className="text-[10px] text-white/30 mt-0.5 leading-tight">
														{item.desc}
													</p>
												)}
											</div>
											<ChevronRight className="size-3.5 text-white/20 group-hover/item:text-white/40 transition-colors" />
										</Link>
									);
								})}
							</div>

							{/* Logout */}
							<div className="border-t border-white/5 p-1.5">
								<button
									disabled={isLoading}
									onClick={onLogout}
									className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-red-400/80 hover:bg-red-500/6 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50 group/logout"
								>
									<div className="rounded-lg p-1.5 bg-red-500/6 group-hover/logout:bg-red-500/10 transition-colors">
										{isLoading ? (
											<Loader2 className="size-3.5 animate-spin" />
										) : (
											<LogOut className="size-3.5" />
										)}
									</div>
									<span className="font-medium">
										{isLoading ? "Signing out…" : "Sign Out"}
									</span>
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function MobileMenu({
	user,
	items,
	isLoading,
	onLogout,
}: {
	user: AuthSessionType["user"];
	items: NavItem[];
	isLoading: boolean;
	onLogout: () => void;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Trigger avatar button */}
			<button
				onClick={() => setOpen(true)}
				className="group relative flex items-center rounded-full p-0.5 transition-all active:scale-95 cursor-pointer"
			>
				<UserAvatar
					src={user.image}
					name={user.name}
					size="sm"
					subscriptionStatus={user.subscriptionStatus}
					currentPlan={user.currentPlan}
				/>
			</button>

			{/* Bottom-sheet drawer (iOS-style) */}
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerContent className="bg-[#111113] border-white/6 max-h-[85dvh]">
					{/* Grab handle */}
					<div className="flex justify-center pt-3 pb-1">
						<div className="w-10 h-1 rounded-full bg-white/10" />
					</div>

					<DrawerHeader className="px-5 pt-3 pb-4 text-left">
						<DrawerTitle className="sr-only">Account Menu</DrawerTitle>
						{/* Profile block */}
						<div className="flex items-center gap-3.5">
							<UserAvatar
								src={user.image}
								name={user.name}
								size="lg"
								subscriptionStatus={user.subscriptionStatus}
								currentPlan={user.currentPlan}
							/>
							<div className="flex-1 min-w-0">
								<p className="text-lg font-semibold text-white truncate leading-tight">
									{user.name}
								</p>
								<p className="text-sm text-white/40 truncate mt-0.5">
									{user.email}
								</p>
								<div className="flex flex-wrap gap-1.5 mt-2">
									<RoleBadge role={user.role as string} />
									<SubscriptionBadge
										status={user.subscriptionStatus}
										currentPlan={user.currentPlan}
									/>
								</div>
							</div>
						</div>
					</DrawerHeader>

					{/* Benefits */}
					{user.subscriptionStatus !== "FREE" && (
						<div className="mx-5 mb-3 px-4 py-3 rounded-2xl bg-white/3 border border-white/5">
							<div className="flex items-center justify-between mb-2">
								<span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
									Your Benefits
								</span>
								<DrawerClose asChild>
									<Link
										to="/library/subscription"
										className="text-[11px] font-semibold text-indigo-400/80"
									>
										Manage →
									</Link>
								</DrawerClose>
							</div>
							<div className="grid grid-cols-2 gap-2">
								{[
									{ label: "HD Streaming", always: true },
									{ label: "Ad-free", always: true },
									{ label: "4K + HDR", premium: true },
									{ label: "Dolby Atmos", premium: true },
								]
									.filter(
										(b) =>
											b.always ||
											(b.premium && user.subscriptionStatus === "PREMIUM"),
									)
									.map((b) => (
										<div
											key={b.label}
											className="flex items-center gap-1.5 text-xs text-white/50"
										>
											{b.premium ? (
												<Gem className="size-3.5 text-amber-400/70" />
											) : (
												<BadgeCheck className="size-3.5 text-indigo-400/70" />
											)}
											<span>{b.label}</span>
										</div>
									))}
							</div>
						</div>
					)}

					{/* Nav items */}
					<div className="px-3 pb-2 space-y-1">
						{items.map((item) => {
							const Icon = item.icon;
							return (
								<DrawerClose key={item.to} asChild>
									<Link
										to={item.to}
										onClick={(e) => {
											if (item.onClick) {
												e.preventDefault();
												item.onClick();
											}
										}}
										className={cn(
											"flex items-center gap-3 rounded-2xl px-4 py-3 transition-all active:scale-[0.98]",
											item.highlight
												? "bg-linear-to-r from-indigo-500/10 to-purple-500/10 text-indigo-300 border border-indigo-500/20"
												: "text-white/70 hover:bg-white/4",
										)}
									>
										<div
											className={cn(
												"rounded-xl p-2",
												item.highlight ? "bg-indigo-500/20" : "bg-white/4",
											)}
										>
											<Icon className="size-5" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-semibold text-sm leading-tight">
												{item.label}
											</p>
											{item.desc && (
												<p className="text-[11px] text-white/30 mt-0.5 leading-tight">
													{item.desc}
												</p>
											)}
										</div>
										<ChevronRight className="size-4 text-white/20" />
									</Link>
								</DrawerClose>
							);
						})}
					</div>

					{/* Logout */}
					<div className="border-t border-white/5 mx-3 px-1 py-3 pb-[max(env(safe-area-inset-bottom),1rem)]">
						<button
							disabled={isLoading}
							onClick={onLogout}
							className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-400/80 hover:bg-red-500/6 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
						>
							<div className="rounded-xl p-2 bg-red-500/6">
								{isLoading ? (
									<Loader2 className="size-5 animate-spin" />
								) : (
									<LogOut className="size-5" />
								)}
							</div>
							<span className="font-semibold text-sm">
								{isLoading ? "Signing out…" : "Sign Out"}
							</span>
						</button>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function UserMenu() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { isMobile } = useMediaQuery();

	const { auth } = Route.useRouteContext();
	const user = auth?.user;

	const items = useMenuItems({
		role: user?.role,
		subscriptionStatus: user?.subscriptionStatus,
	});

	const handleLogout = useCallback(async () => {
		setIsLoading(true);
		await authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					toast.success("Signed out");
					setIsLoading(false);
					await router.invalidate();
					router.navigate({ to: "/login" });
				},
				onError: () => {
					setIsLoading(false);
					toast.error("Failed to sign out");
				},
			},
		});
	}, [router]);

	if (!user) return null;

	return isMobile ? (
		<MobileMenu
			user={user}
			items={items}
			isLoading={isLoading}
			onLogout={handleLogout}
		/>
	) : (
		<DesktopMenu
			user={user}
			items={items}
			isLoading={isLoading}
			onLogout={handleLogout}
		/>
	);
}
