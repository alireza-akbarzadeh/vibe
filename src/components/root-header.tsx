import { Link, useLocation } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import {
	BookText,
	ChevronRight,
	Clapperboard,
	CreditCard,
	Menu,
	Music,
	PlaySquare,
	Sparkles,
	X
} from "lucide-react";
import { useState } from "react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { MSG } from "@/constants/constants";
import { cn } from "@/lib/utils";

const navLinks = [
	{ label: "Music", href: "/music", icon: Music },
	{ label: "Movies", href: "/movies", icon: Clapperboard },
	{ label: "Reels", href: "/reels", icon: PlaySquare },
	{ label: "Weblog", href: "/blog", icon: BookText },
	{ label: "Pricing", href: "/pricing", icon: CreditCard },
];

export function RootHeader() {
	const [isOpen, setIsOpen] = useState(false);
	const { scrollY } = useScroll();
	const location = useLocation();

	// --- ANIMATIONS ---
	const headerWidth = useTransform(scrollY, [0, 80], ["100%", "95%"]);
	const headerBorder = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)"]);
	const headerShadow = useTransform(scrollY, [0, 80], ["0px 0px 0px rgba(0,0,0,0)", "0px 20px 40px rgba(0,0,0,0.4)"]);
	const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.8]);

	return (
		<motion.header
			style={{
				width: headerWidth,
				boxShadow: headerShadow,
				borderColor: headerBorder
			}}
			className={cn(
				"fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500",
				"backdrop-blur-xl md:rounded-[2rem] border-x border-b md:border-t",
				"md:max-w-7xl mx-auto overflow-visible top-0"
			)}
		>
			{/* Background Layer */}
			<motion.div
				style={{ opacity: bgOpacity }}
				className="absolute inset-0 bg-[#0a0a0b] md:rounded-[2rem] -z-10"
			/>

			<nav className="px-6 py-3.5 relative">
				<div className="flex items-center justify-between">

					{/* 1. LOGO */}
					<Link to="/" className="flex items-center gap-3 group">
						<div className="relative">
							<div className="absolute inset-0 bg-purple-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
							<div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform duration-300">
								<Music className="w-5 h-5 text-white" />
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-black tracking-tight text-white leading-none">
								{MSG.APP_NAME}
							</span>
							<span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1">
								Premium
							</span>
						</div>
					</Link>

					{/* 2. DESKTOP NAV PILL */}
					<div className="hidden lg:flex items-center bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full p-1.5 gap-1 shadow-inner">
						{navLinks.map((link) => {
							const isActive = location.pathname === link.href;
							return (
								<Link
									key={link.label}
									to={link.href}
									className={cn(
										"relative px-5 py-2 text-[13px] font-bold transition-all rounded-full overflow-hidden group",
										isActive ? "text-white" : "text-slate-400 hover:text-white"
									)}
								>
									{isActive && (
										<motion.div
											layoutId="nav-pill"
											className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/10 rounded-full"
											transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
										/>
									)}
									<span className="relative z-10 flex items-center gap-1.5">
										{link.label}
										{link.label === "Pricing" && <Sparkles className="size-3 text-yellow-500" />}
									</span>
								</Link>
							);
						})}
					</div>

					{/* 3. ACTIONS & MOBILE TRIGGER */}
					<div className="flex items-center gap-3">
						<div className="hidden md:flex items-center gap-4 mr-2">
							<Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
								Login
							</Link>
							<Link to="/register" className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-white text-black font-black text-xs uppercase tracking-tighter hover:scale-105 transition-transform active:scale-95">
								Join Now
							</Link>
						</div>

						{/* MOBILE DRAWER (VAUL) */}
						<Drawer open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>
							<DrawerTrigger asChild>
								<button className="lg:hidden p-2.5 bg-white/5 rounded-full border border-white/10 text-slate-300 active:scale-95 transition-all">
									<Menu className="size-5" />
								</button>
							</DrawerTrigger>
							<DrawerContent className="bg-[#0a0a0b] border-white/10 text-white rounded-t-[2.5rem] outline-none max-h-[92vh]">
								{/* DRAG HANDLE (Visual clue for dragging) */}
								<div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-white/20" />

								<DrawerHeader className="flex flex-row items-center justify-between px-8 pt-6">
									<div className="flex flex-col gap-1">
										<DrawerTitle className="text-2xl font-black tracking-tighter">Explore</DrawerTitle>
										<p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em]">Navigation</p>
									</div>
									<DrawerClose asChild>
										<button className="p-2.5 bg-white/5 rounded-full text-slate-400 hover:text-white outline-none">
											<X className="size-5" />
										</button>
									</DrawerClose>
								</DrawerHeader>

								<div className="px-6 pb-10 pt-4 overflow-y-auto">
									<div className="space-y-1">
										{navLinks.map((link) => (
											<Link
												key={link.label}
												to={link.href}
												onClick={() => setIsOpen(false)}
												className="flex items-center gap-4 py-4 px-3 rounded-2xl active:bg-white/5 transition-all group"
											>
												<div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-active:scale-90 transition-transform">
													<link.icon className="size-5 text-slate-300 group-active:text-purple-400" />
												</div>
												<span className="text-lg font-bold text-slate-200 flex-1">
													{link.label}
												</span>
												<ChevronRight className="size-5 text-slate-700 group-active:translate-x-1 transition-transform" />
											</Link>
										))}
									</div>

									{/* DRAWER FOOTER ACTIONS */}
									<div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
										<Link
											to="/login"
											onClick={() => setIsOpen(false)}
											className="flex items-center justify-center py-4 text-slate-300 font-bold bg-white/5 rounded-2xl active:scale-95 transition-transform"
										>
											Sign In
										</Link>
										<Link
											to="/register"
											onClick={() => setIsOpen(false)}
											className="flex items-center justify-center py-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
										>
											Join Now
										</Link>
									</div>
								</div>
							</DrawerContent>
						</Drawer>
					</div>
				</div>
			</nav>
		</motion.header>
	);
}