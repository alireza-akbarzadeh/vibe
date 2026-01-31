import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Menu, Music, X } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { MSG } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

const navLinks = [
	{ label: "Music", href: "/music" },
	{ label: "Movies", href: "/movies" },
	{ label: "Weblog", href: "/blog" },
	{ label: "Pricing", href: "/pricing" },
	{ label: "Download", href: "/download" },
	{ label: "Dashboard", href: "/dashboard" },
];

export function RootHeader() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { scrollY } = useScroll();
	const location = useLocation();

	// Smoothly transform header width and padding based on scroll
	const headerWidth = useTransform(scrollY, [0, 50], ["100%", "90%"]);
	const headerTop = useTransform(scrollY, [0, 50], ["0px", "16px"]);
	const backgroundColor = useTransform(
		scrollY,
		[0, 50],
		["rgba(0, 0, 0, 0)", "rgba(15, 23, 42, 0.7)"]
	);

	return (
		<motion.header
			style={{
				width: headerWidth,
				top: headerTop,
				backgroundColor
			}}
			className={cn(
				"fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
				"backdrop-blur-md rounded-2xl border border-transparent",
				"max-w-7xl mx-auto"
			)}
		>
			<nav className="px-6 py-3">
				<div className="flex items-center justify-between">
					{/* Logo Section */}
					<Link to="/" className="flex items-center gap-3 group">
						<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
							<Music className="w-5 h-5 text-white" />
						</div>
						<span className="text-lg font-bold tracking-tight text-white hidden sm:block">
							{MSG.APP_NAME}
						</span>
					</Link>

					{/* Desktop Navigation - Pill Shape */}
					<div className="hidden md:flex items-center bg-white/[0.03] border border-white/5 rounded-full px-2 py-1 gap-1">
						{navLinks.map((link) => {
							const isActive = location.pathname === link.href;
							return (
								<Link
									key={link.label}
									to={link.href}
									className={cn(
										"relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full",
										isActive ? "text-white" : "text-slate-400 hover:text-white"
									)}
								>
									{isActive && (
										<motion.div
											layoutId="nav-active"
											className="absolute inset-0 bg-white/10 rounded-full shadow-inner"
											transition={{ type: "spring", duration: 0.5 }}
										/>
									)}
									<span className="relative z-10">{link.label}</span>
								</Link>
							);
						})}
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-2">
						<div className="hidden md:flex items-center gap-1">
							<Link
								to="/login"
								className={cn(
									buttonVariants({ variant: "ghost", size: "sm" }),
									"text-slate-400 hover:text-white rounded-full"
								)}
							>
								Log in
							</Link>
							<Link
								to="/register"
								className={cn(
									buttonVariants({ size: "sm" }),
									"bg-white text-black hover:bg-slate-200 rounded-full px-5 font-semibold"
								)}
							>
								Sign up
							</Link>
						</div>

						<div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />
						<ModeToggle />

						{/* Mobile Toggle */}
						<button
							type="button"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
						>
							{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="md:hidden absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
					>
						<div className="p-4 space-y-2">
							{navLinks.map((link) => (
								<Link
									key={link.label}
									to={link.href}
									className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{link.label}
								</Link>
							))}
							<div className="pt-4 mt-2 border-t border-white/5 space-y-3">
								<Link
									to="/register"
									className="w-full flex justify-center py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold"
								>
									Start Free Trial
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}