import { Link, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Circle, Crown, Library, Loader2, LogOut, Settings, Sparkles } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Image } from "@/components/ui/image.tsx";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/__root";

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

				<div className="relative size-9 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-indigo-400/60 transition-all">
					<Image
						src={user.image || `https://avatar.iran.liara.run/username?username=${user.name}`}
						alt={user.name}
						className="h-full w-full object-cover"
					/>
				</div>

				{/* Show Crown only if PRO or PREMIUM based on your Prisma Enum */}
				{user.subscriptionStatus !== "FREE" && (
					<Crown className="size-4 text-yellow-400 opacity-80 group-hover:opacity-100 transition-opacity" />
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
							"absolute right-0 mt-1 w-64 overflow-hidden",
							"rounded-2xl border border-white/10",
							"bg-[#0b0b0c]/90 backdrop-blur-xl shadow-2xl",
						)}
					>
						{/* USER INFO */}
						<div className="px-4 py-3 border-b border-white/5">
							<p className="text-sm font-semibold text-white">
								{user.name}
							</p>
							<p className="text-xs text-slate-400 capitalize">
								{user.subscriptionStatus.toLowerCase()} Member
							</p>
						</div>

						{/* ACTIONS */}
						<div className="p-2 space-y-1">
							<MenuItem to="/library" icon={Library} label="Library" />
							<MenuItem to="/library/setting" icon={Settings} label="Settings" />
							<MenuItem
								to="/library/subscription"
								icon={Sparkles}
								label="Manage Subscription"
								highlight
							/>
						</div>

						{/* LOGOUT */}
						<div className="border-t border-white/5 p-2">
							<motion.button
								whileHover={{ x: 4 }} // Slides right slightly on hover
								whileTap={{ scale: 0.95 }} // "Squish" effect on click
								disabled={isLoading}
								onClick={handleLogout}
								className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer disabled:opacity-50"
							>
								<motion.div
									animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
									transition={{ repeat: isLoading ? Infinity : 0, duration: 1, ease: "linear" }}
								>
									{isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogOut className="size-4" />}
								</motion.div>

								{isLoading ? (
									<span>Logging out...</span>
								) : (
									<span>Logout</span>
								)}
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
function MenuItem({
	to,
	icon: Icon,
	label,
	highlight,
}: {
	to: string;
	icon: React.ElementType;
	label: string;
	highlight?: boolean;
}) {
	return (
		<Link
			to={to}
			className={cn(
				"flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
				highlight
					? "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
					: "text-slate-300 hover:bg-white/5",
			)}
		>
			<Icon className="size-4" />
			{label}
		</Link>
	);
}
