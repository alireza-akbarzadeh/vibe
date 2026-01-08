import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Music, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ArtistCard,
	GenreFilters,
	ProgressTracker,
	TasteProfile,
} from "./components";
import { artists } from "./data";
import { discoveryActions, discoveryStore } from "./discoveryStore";

export function Discovery() {
	const selectedArtists = useStore(discoveryStore, (s) => s.selectedArtists);
	const searchQuery = useStore(discoveryStore, (s) => s.searchQuery);
	const activeFilter = useStore(discoveryStore, (s) => s.activeFilter);

	// 2. Local UI State (Keep as useState for performance/simplicity)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [showWelcome, setShowWelcome] = useState(true);

	const navigate = useNavigate();
	const minSelections = 5;
	const recommendedSelections = 10;

	const filteredArtists = artists.filter((artist) => {
		const matchesSearch =
			artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			artist.genres.some((g: string) =>
				g.toLowerCase().includes(searchQuery.toLowerCase()),
			);

		if (activeFilter === "all") return matchesSearch;
		if (activeFilter === "trending") return matchesSearch && artist.trending;
		if (activeFilter === "recommended")
			return matchesSearch && artist.recommended;
		if (activeFilter === "music")
			return matchesSearch && artist.type === "music";
		if (activeFilter === "movies")
			return matchesSearch && artist.type === "movie";
		return matchesSearch;
	});

	useEffect(() => {
		const timer = setTimeout(() => setShowWelcome(false), 2000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) =>
			setMousePosition({ x: e.clientX, y: e.clientY });
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const handleContinue = (): void => {
		navigate({ to: "/" });
	};

	return (
		<div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
			{/* Animated background with cursor following effect */}
			<div className="fixed inset-0 pointer-events-none">
				<motion.div
					animate={{
						background: [
							"radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
							"radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
							"radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
						],
					}}
					transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
					className="absolute inset-0"
				/>

				<motion.div
					style={{
						left: mousePosition.x - 300,
						top: mousePosition.y - 300,
					}}
					className="absolute w-150 h-150 bg-linear-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 rounded-full blur-3xl"
				/>

				{/* Floating particles */}
				{[...Array(20)].map((b) => (
					<motion.div
						key={`secrekey${b}`}
						initial={{ opacity: 0 }}
						animate={{
							opacity: [0.1, 0.3, 0.1],
							y: [0, -100, 0],
							x: [0, Math.random() * 50 - 25, 0],
						}}
						transition={{
							duration: 5 + Math.random() * 5,
							repeat: Infinity,
							delay: Math.random() * 5,
						}}
						className="absolute w-1 h-1 bg-purple-400 rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
					/>
				))}
			</div>

			{/* Welcome overlay */}
			<AnimatePresence>
				{showWelcome && (
					<motion.div
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black"
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 1.2, opacity: 0 }}
							transition={{ duration: 0.6 }}
							className="text-center"
						>
							<motion.div
								animate={{
									rotate: [0, 360],
								}}
								transition={{ duration: 2, ease: "linear", repeat: Infinity }}
								className="inline-block mb-6"
							>
								<Sparkles className="w-16 h-16 text-purple-400" />
							</motion.div>
							<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
								Welcome to{" "}
								<span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
									Your Journey
								</span>
							</h1>
							<p className="text-xl text-gray-400">
								Let's discover what you love
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Main content */}
			<div className="relative z-10">
				{/* Header */}
				<div className="sticky top-0 z-40 bg-black/50 backdrop-blur-2xl border-b border-white/5">
					<div className="max-w-7xl mx-auto px-6 py-6">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
							<div>
								<motion.h1
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									className="text-3xl md:text-4xl font-bold text-white mb-2"
								>
									Shape Your{" "}
									<span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
										Taste
									</span>
								</motion.h1>
								<motion.p
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 }}
									className="text-gray-400"
								>
									Select at least {minSelections} artists or creators you love
								</motion.p>
							</div>

							<ProgressTracker
								current={selectedArtists.length}
								min={minSelections}
								recommended={recommendedSelections}
							/>
						</div>

						{/* Search and filters */}
						<div className="mt-6 flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
								<Input
									value={searchQuery}
									onChange={(e) => discoveryActions.setSearch(e.target.value)}
									placeholder="Search artists, genres..."
									className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl"
								/>
							</div>

							<GenreFilters
								activeFilter={activeFilter}
								onFilterChange={discoveryActions.setFilter}
							/>
						</div>
					</div>
				</div>

				{/* Artist grid - Bento box layout */}
				<div className="max-w-7xl mx-auto px-6 py-12">
					{/* Taste Profile preview */}
					{selectedArtists.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="mb-8"
						>
							<TasteProfile selectedArtists={selectedArtists} />
						</motion.div>
					)}

					{/* Artists grid */}
					<motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
						{filteredArtists.map((artist, index) => (
							<ArtistCard
								key={artist.id}
								artist={artist}
								isSelected={selectedArtists.some((a) => a.id === artist.id)}
								onToggle={() => discoveryActions.toggleArtist(artist)}
								index={index}
							/>
						))}
					</motion.div>

					{filteredArtists.length === 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center py-20"
						>
							<Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
							<p className="text-gray-400 text-lg">No artists found</p>
							<p className="text-gray-600 text-sm mt-2">
								Try a different search or filter
							</p>
						</motion.div>
					)}
				</div>

				{/* Floating continue button */}
				<AnimatePresence>
					{selectedArtists.length >= minSelections && (
						<motion.div
							initial={{ y: 100, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 100, opacity: 0 }}
							className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
						>
							<Button
								onClick={handleContinue}
								className="h-14 px-8 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-full shadow-2xl shadow-purple-500/50 group"
							>
								<span>Continue to Vibe</span>
								<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
