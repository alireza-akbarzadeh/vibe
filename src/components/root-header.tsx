import { Link, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Music, X } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { MSG } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

const navLinks = [
	{ label: "Music", href: "/music" },
	{ label: "Movies", href: "/movies" },
	{ label: "Pricing", href: "/pricing" },
	{ label: "Weblog", href: "/blog" },
	{ label: "Download", href: "/download" },
];
export function RootHeader() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6 }}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled ? "bg-black/80 backdrop-blur-xl " : "bg-transparent"
			}`}
		>
			<nav className="max-w-7xl mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
							<Music className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold text-white">{MSG.APP_NAME}</span>
					</Link>

					{/* Desktop nav */}
					<div className="hidden md:flex items-center gap-8">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								to={link.href}
								className="text-gray-400 data-[status=active]:font-bold data-[status=active]:text-white hover:text-white transition-colors text-sm font-medium"
							>
								{link.label}
							</Link>
						))}
					</div>

					{/* CTA buttons */}
					<div className="hidden md:flex items-center gap-4">
						<Link
							to="/login"
							className={cn(
								buttonVariants({
									className: "text-gray-400 hover:text-white hover:bg-white/10",
									variant: "ghost",
								}),
							)}
						>
							Log in
						</Link>
						<Link
							to="/register"
							className="bg-white text-black hover:bg-gray-200 rounded-full px-6 py-1.5"
						>
							Start Free Trial
						</Link>
					</div>

					{/* Mobile menu button */}
					<button
						type="button"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden p-2 text-white"
					>
						{isMobileMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>
			</nav>

			{/* Mobile menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5"
					>
						<div className="px-6 py-6 space-y-4">
							{navLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									className="block text-gray-400 hover:text-white transition-colors py-2 text-lg"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{link.label}
								</a>
							))}
							<div className="pt-4 border-t border-white/10 space-y-3">
								<Link
									to="/login"
									className={cn(
										buttonVariants({
											variant: "ghost",
											className:
												"w-full justify-center text-gray-400 hover:text-white hover:bg-white/10",
										}),
									)}
								>
									Log in
								</Link>
								<Link
									to="/register"
									className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full"
								>
									Start Free Trial
								</Link>
								<ModeToggle />
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
