import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
	{ label: "Music", href: "#" },
	{ label: "Movies", href: "#" },
	{ label: "Pricing", href: "#" },
	{ label: "Download", href: "#" },
];

interface DiscoveryLayoutProps {
	children: React.ReactNode;
}
export function Layout({ children }: DiscoveryLayoutProps) {
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
		<div className="min-h-screen bg-[#0a0a0a]">
			<style>{`
        :root {
          --background: 0 0% 4%;
          --foreground: 0 0% 98%;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          background-color: #0a0a0a;
          color: #fafafa;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

			{/* Navigation */}
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6 }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled
						? "bg-black/80 backdrop-blur-xl border-b border-white/5"
						: "bg-transparent"
				}`}
			>
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
									<Button
										variant="ghost"
										className="w-full justify-center text-gray-400 hover:text-white hover:bg-white/10"
									>
										Log in
									</Button>
									<Button className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full">
										Start Free Trial
									</Button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.header>

			{/* Main content */}
			<main>{children}</main>
		</div>
	);
}
