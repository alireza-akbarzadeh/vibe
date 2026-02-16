import { useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
} from "@/components/ui/drawer";
import { MobileSearch } from "./mobile-search";
import { MoviesSearchInput } from "./movies-search-input";

interface SearchHeaderProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	title?: string;
}

export function SearchHeader({
	searchQuery,
	onSearchChange,
	title,
}: SearchHeaderProps) {
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const router = useRouter();
	const auth = router.options.context?.auth;

	// Get user initials from name or email
	const getUserInitials = () => {
		const name = auth?.user?.name;
		const email = auth?.user?.email;

		if (name) {
			const names = name.trim().split(" ");
			if (names.length >= 2) {
				return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
			}
			return name.substring(0, 2).toUpperCase();
		}

		if (email) {
			return email.substring(0, 2).toUpperCase();
		}

		return "JD";
	};

	return (
		<>
			<motion.div
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5"
			>
				<div className="max-w-450 mx-auto px-6 py-4">
					<div className="flex items-center gap-4 justify-between">
						{/* Logo - always visible */}
						<Logo />

						{/* Desktop layout - search and avatar */}
						<div className="hidden md:flex items-center gap-4 flex-1">
							<div className="flex-1">
								<MoviesSearchInput
									searchQuery={searchQuery}
									onSearchChange={onSearchChange}
								/>
							</div>

							<div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shrink-0">
								<span className="text-white font-bold text-sm">
									{getUserInitials()}
								</span>
							</div>
						</div>

						{/* Mobile layout - search icon and avatar at the end */}
						<div className="md:hidden flex items-center gap-3 ml-auto">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setMobileSearchOpen(true)}
								className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
							>
								<Search className="w-5 h-5" />
							</Button>

							<div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shrink-0">
								<span className="text-white font-bold text-sm">
									{getUserInitials()}
								</span>
							</div>
						</div>

						{title ? (
							<h2 className="text-2xl md:text-3xl font-bold text-white pl-6">
								{title}
							</h2>
						) : null}
					</div>
				</div>
			</motion.div>

			{/* Mobile search drawer */}
			<Drawer open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
				<DrawerContent className="bg-black/95 backdrop-blur-xl border-white/10 h-[85vh]">
					<div className="flex flex-col h-full px-4 pt-6 pb-4">
						<MobileSearch
							searchQuery={searchQuery}
							onSearchChange={onSearchChange}
						/>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
