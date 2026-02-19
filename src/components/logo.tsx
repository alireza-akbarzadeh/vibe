import { Link, useRouter } from "@tanstack/react-router";
import { Music, Play } from "lucide-react";
import { motion } from "@/components/motion";
import { MSG } from "@/constants/constants";

type SubscriptionStatus = "FREE" | "PREMIUM" | "FAMILY";

const statusColors = {
	FREE: {
		gradient: "from-indigo-500 via-purple-500 to-pink-500",
		icon: "text-indigo-400",
		badge: "text-indigo-400",
		ping: "bg-indigo-400",
		dot: "bg-indigo-500",
	},
	PREMIUM: {
		gradient: "from-amber-400 via-orange-400 to-yellow-400",
		icon: "text-amber-400",
		badge: "text-amber-400",
		ping: "bg-amber-400",
		dot: "bg-amber-500",
	},
	FAMILY: {
		gradient: "from-emerald-400 via-teal-400 to-cyan-400",
		icon: "text-emerald-400",
		badge: "text-emerald-400",
		ping: "bg-emerald-400",
		dot: "bg-emerald-500",
	},
};

export function Logo() {
	const router = useRouter();
	const auth = router.options.context.auth;
	const status = (auth?.user?.subscriptionStatus ||
		"FREE") as SubscriptionStatus;
	const colors = statusColors[status] || statusColors.FREE;

	return (
		<Link to="/" className="flex items-center gap-4 group shrink-0">
			<div className="relative">
				<div
					className={`absolute inset-0 bg-linear-to-tr ${colors.gradient} blur-2xl opacity-20 group-hover:opacity-60 transition-opacity duration-500`}
				/>

				{/* Main Logo Vessel */}
				<div className="relative w-12 h-12 rounded-4xl bg-[#0d0d0f] border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500 overflow-hidden">
					{/* Video Elements - Representing "Motion/Video" */}
					<div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
						<div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/40" />
						<div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/40" />
						<div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/40" />
						<div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/40" />
					</div>

					{/* The "Play" backdrop with status-based color */}
					<motion.div
						animate={{
							opacity: [0.3, 0.6, 0.3],
						}}
						transition={{ duration: 4, repeat: Infinity }}
						className="absolute inset-0 flex items-center justify-center"
					>
						<Play
							className={`w-9 h-9 ${colors.icon} fill-${colors.icon.replace("text-", "")}/10 stroke-[1px]`}
						/>
					</motion.div>

					{/* HERO MUSIC ICON */}
					<motion.div
						whileHover={{ scale: 1.15, rotate: 10 }}
						className="relative z-10 flex items-center justify-center"
					>
						<div className="absolute inset-0 bg-white blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
						<Music
							className={`w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]`}
						/>
					</motion.div>

					{/* Glass Sweep Animation */}
					<div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
				</div>
			</div>

			{/* Typography Section */}
			<div className="flex flex-col">
				<div className="flex items-center gap-1.5">
					<span className="text-base font-black tracking-tighter text-white leading-none">
						{MSG.APP_NAME}
					</span>
					<span className="relative flex h-2 w-2">
						<span
							className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.ping} opacity-75`}
						></span>
						<span
							className={`relative inline-flex rounded-full h-2 w-2 ${colors.dot}`}
						></span>
					</span>
				</div>

				<div className="flex items-center gap-2 mt-1.5">
					<div className="flex items-center gap-1">
						<span className="text-[7px] text-slate-500 font-black uppercase tracking-[0.3em]">
							Music
						</span>
						<div className="w-1 h-1 rounded-full bg-slate-700" />
						<span className="text-[7px] text-slate-500 font-black uppercase tracking-[0.3em]">
							Video
						</span>
					</div>
					<span className="h-px w-3 bg-white/10" />
					<span
						className={`text-[8px] ${colors.badge} font-bold uppercase tracking-widest`}
					>
						{status}
					</span>
				</div>
			</div>
		</Link>
	);
}
