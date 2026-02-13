import { Link, useLocation } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import {
	BookText,
	Clapperboard,
	CreditCard,
	LogIn,
	Music,
	PlaySquare,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import { UserMenu } from "@/components/user-menui/user-menu";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/__root";
import { JoinButton } from "./buttons/join-button";
import { Logo } from "./logo";
import { MobileHeader } from "./mobile-header";

export const navLinks = [
	{ label: "Music", href: "/music", icon: Music },
	{ label: "Movies", href: "/movies", icon: Clapperboard },
	{ label: "Shorts", href: "/reels", icon: PlaySquare },
	{ label: "Weblog", href: "/blog", icon: BookText },
	{ label: "Pricing", href: "/pricing", icon: CreditCard },
];

export function RootHeader() {
	const [isOpen, setIsOpen] = useState(false);
	const { scrollY } = useScroll();
	const location = useLocation();
	const { auth } = Route.useRouteContext();

	const user = auth?.user;
	const isLoggedIn = !!user;


	const headerWidth = useTransform(scrollY, [0, 80], ["100%", "92%"]);
	const headerY = useTransform(scrollY, [0, 80], [0, 12]);
	const headerBorder = useTransform(
		scrollY,
		[0, 80],
		["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"],
	);
	const headerShadow = useTransform(
		scrollY,
		[0, 80],
		["0px 0px 0px rgba(0,0,0,0)", "0px 25px 50px -12px rgba(0,0,0,0.5)"],
	);
	const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.4]);

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
				"backdrop-blur-xl md:rounded-[2.5rem] border",
				"md:max-w-7xl mx-auto top-0 overflow-visible",
			)}
		>
			<motion.div
				style={{ opacity: bgOpacity }}
				className="absolute inset-0 bg-linear-to-b from-white/8 to-transparent md:rounded-[2.5rem] -z-10"
			/>
			<div className="absolute inset-0 bg-[#0a0a0b]/80 md:rounded-[2.5rem] -z-20" />

			<nav className="px-5 py-2.5 relative">
				<div className="flex items-center justify-between gap-4">
					<Logo />
					{/* 2. DESKTOP NAV PILL */}
					<div className="hidden lg:flex items-center bg-white/3 hover:bg-white/5 border border-white/5 backdrop-blur-2xl rounded-full p-1.5 gap-0.5 transition-colors duration-300">
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
											className="absolute inset-0 bg-white/8 border border-white/10 rounded-full"
											transition={{
												type: "spring",
												bounce: 0.25,
												duration: 0.5,
											}}
										/>
									)}
									<Icon
										className={cn(
											"size-4 transition-transform duration-300 group-hover:scale-110",
											isActive
												? "text-purple-400"
												: "text-slate-500 group-hover:text-slate-300",
										)}
									/>
									<span className="relative z-10">{link.label}</span>
									{link.label === "Pricing" && (
										<Sparkles className="size-3 text-yellow-500 animate-bounce" />
									)}
								</Link>
							);
						})}
					</div>

					{/* 3. DESKTOP ACTIONS (ENGAGING JOIN NOW) */}
					<div className="hidden md:flex items-center gap-3 shrink-0">
						{isLoggedIn ? (
							<UserMenu />
						) : (
							<>
								<Link
									to="/login"
									className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2"
								>
									<LogIn className="size-4" />
									Login
								</Link>
								<motion.div
									initial="initial"
									animate="animate"
									whileHover="hover"
									whileTap="tap"
									className="relative"
								>
									{/* The Glowing Aura - keep it subtle so the focus stays on the arrow */}
									<motion.div
										animate={{
											scale: [1, 1.15, 1],
											opacity: [0.2, 0.4, 0.2],
										}}
										transition={{
											duration: 3,
											repeat: Infinity,
											ease: "easeInOut",
										}}
										className="absolute inset-0 bg-indigo-500 rounded-full blur-md -z-10"
									/>

									<Link
										to="/register"
										className={cn(
											"relative flex items-center gap-2 px-7 py-2.5 rounded-full font-black text-[11px] uppercase tracking-tighter shadow-xl overflow-hidden",
											"bg-white text-black transition-all duration-300",
										)}
									>
										{/* Shimmer Effect */}
										<motion.div
											animate={{ x: ["-100%", "200%"] }}
											transition={{
												duration: 3,
												repeat: Infinity,
												repeatDelay: 1,
											}}
											className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/10 to-transparent skew-x-12"
										/>

										<span className="relative z-10">Join Now</span>

										<JoinButton />
									</Link>
								</motion.div>
							</>
						)}
					</div>

					{/* 4. MOBILE TRIGGER */}
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
