import { Link, useLocation } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import {
	LogIn,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import { UserMenu } from "@/components/user-menui/user-menu";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/__root";
import { JoinButton } from "./buttons/join-button";
import { Logo } from "./logo";
import { MobileHeader } from "./mobile-header";
import { navLinks } from "./nav-links";

export function RootHeader() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const { scrollY } = useScroll();
	const location = useLocation();
	const { auth } = Route.useRouteContext();

	const user = auth?.user;
	const isLoggedIn = !!user;

	useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

	const headerWidth = useTransform(scrollY, [0, 80], ["100%", "90%"]);
	const headerY = useTransform(scrollY, [0, 80], [0, 14]);
	const headerBorder = useTransform(
		scrollY,
		[0, 80],
		["rgba(255,255,255,0)", "rgba(255,255,255,0.06)"],
	);
	const headerShadow = useTransform(
		scrollY,
		[0, 80],
		[
			"0px 0px 0px rgba(0,0,0,0)",
			"0px 20px 60px -15px rgba(0,0,0,0.6), 0px 0px 40px -10px rgba(139,92,246,0.08)",
		],
	);
	const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.55]);

	return (
		<motion.header
			style={{
				width: headerWidth,
				boxShadow: headerShadow,
				borderColor: headerBorder,
				y: headerY,
			}}
			className={cn(
				"fixed left-1/2 -translate-x-1/2 z-100 transition-all duration-700 ease-out",
				"backdrop-blur-2xl md:rounded-full border",
				"md:max-w-7xl mx-auto top-0 overflow-visible",
			)}
		>
			{/* Glass fill */}
			<motion.div
				style={{ opacity: bgOpacity }}
				className="absolute inset-0 bg-linear-to-b from-white/8 to-white/3 md:rounded-full -z-10"
			/>
			<div className="absolute inset-0 bg-[#060608]/85 md:rounded-full -z-20" />

			{/* Accent top line — appears on scroll */}
			<motion.div
				initial={false}
				animate={{ opacity: scrolled ? 1 : 0, scaleX: scrolled ? 1 : 0 }}
				transition={{ duration: 0.5 }}
				className="absolute top-0 left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-purple-500/40 to-transparent"
			/>

			<nav className="px-4 md:px-5 py-2 md:py-2.5 relative">
				<div className="flex items-center justify-between gap-3">
					<Logo />

					{/* ── DESKTOP NAV ────────────────────────────── */}
					<div className="hidden lg:flex items-center bg-white/3 hover:bg-white/5 border border-white/5 backdrop-blur-2xl rounded-full p-1 gap-0.5 transition-colors duration-300">
						{navLinks.map((link) => {
							const isActive = location.pathname === link.href;
							const Icon = link.icon;
							return (
								<Link
									key={link.label}
									to={link.href}
									className={cn(
										"relative px-4 py-2 text-[13px] font-bold transition-all rounded-full group flex items-center gap-2",
										isActive
											? "text-white"
											: "text-slate-400 hover:text-slate-200",
									)}
								>
									{isActive && (
										<motion.div
											layoutId="nav-pill-active"
											className="absolute inset-0 bg-linear-to-r from-purple-500/15 to-cyan-500/10 border border-white/10 rounded-full"
											transition={{
												type: "spring",
												bounce: 0.2,
												duration: 0.5,
											}}
										/>
									)}
									<Icon
										className={cn(
											"size-3.5 transition-all duration-300 group-hover:scale-110",
											isActive
												? "text-purple-400"
												: "text-slate-500 group-hover:text-slate-300",
										)}
									/>
									<span className="relative z-10">{link.label}</span>
									{link.label === "Pricing" && (
										<Sparkles className="size-3 text-yellow-500 animate-pulse" />
									)}
								</Link>
							);
						})}
					</div>

					{/* ── DESKTOP ACTIONS ─────────────────────────── */}
					<div className="hidden lg:flex items-center gap-3 shrink-0">
						{isLoggedIn ? (
							<UserMenu />
						) : (
							<>
								<Link
									to="/login"
									className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
								>
									<LogIn className="size-3.5 group-hover:text-cyan-400 transition-colors" />
									Login
								</Link>
								<motion.div
									initial="initial"
									animate="animate"
									whileHover="hover"
									whileTap="tap"
									className="relative"
								>
									{/* Glow */}
									<motion.div
										animate={{
											scale: [1, 1.2, 1],
											opacity: [0.15, 0.35, 0.15],
										}}
										transition={{
											duration: 3,
											repeat: Number.POSITIVE_INFINITY,
											ease: "easeInOut",
										}}
										className="absolute inset-0 bg-linear-to-r from-purple-500 to-cyan-500 rounded-full blur-lg -z-10"
									/>

									<Link
										to="/register"
										className={cn(
											"relative flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-tight shadow-xl overflow-hidden",
											"bg-white text-black hover:bg-white/95 transition-all duration-300",
										)}
									>
										{/* Shimmer */}
										<motion.div
											animate={{ x: ["-100%", "200%"] }}
											transition={{
												duration: 3,
												repeat: Number.POSITIVE_INFINITY,
												repeatDelay: 1.5,
											}}
											className="absolute inset-0 bg-linear-to-r from-transparent via-purple-500/10 to-transparent skew-x-12"
										/>

										<span className="relative z-10">Join Now</span>
										<JoinButton />
									</Link>
								</motion.div>
							</>
						)}
					</div>

					{/* ── MOBILE TRIGGER ──────────────────────────── */}
					<div className="lg:hidden flex items-center">
						<MobileHeader
							side="bottom"
							open={isOpen}
							onOpenChange={setIsOpen}
						/>
					</div>
				</div>
			</nav>
		</motion.header>
	);
}
