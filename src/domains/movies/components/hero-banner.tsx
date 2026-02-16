import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Play, Star, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { AddButton } from "@/components/buttons/add-button";
import { Button, buttonVariants } from "@/components/ui/button";
import type { MediaList } from "@/orpc/models/media.schema";


type HeroBannerProps = {
	latestData: MediaList[]
}
export function HeroBanner({ latestData }: HeroBannerProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isMuted, setIsMuted] = useState(true);



	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % latestData.length);
		}, 8000);
		return () => clearInterval(timer);
	}, [latestData.length]);

	const current = latestData[currentIndex];

	return (
		<div className="relative h-[95vh] w-full overflow-hidden bg-black">
			{/* Multi-layered background */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentIndex}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1.5 }}
					className="absolute inset-0"
				>
					{/* Blurred glow layer */}
					<motion.div
						initial={{ scale: 1.2, opacity: 0 }}
						animate={{ scale: 1, opacity: 0.4 }}
						className="absolute inset-0 blur-[100px] scale-125"
					>
						<img
							src={current.thumbnail}
							alt=""
							className="w-full h-full object-cover"
						/>
					</motion.div>

					{/* Main image layer */}
					<motion.div
						initial={{ scale: 1.1, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 1.2 }}
						className="absolute inset-0"
					>
						<img
							src={current.thumbnail}
							alt={current.title}
							className="w-full h-full object-cover"
						/>

						{/* Dramatic lighting system */}
						<div className="absolute inset-0 bg-radial-[at_20%_40%] from-transparent via-black/40 to-black/90" />
						<div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
						<div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />
					</motion.div>
				</motion.div>
			</AnimatePresence>

			{/* Decorative Elements */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
			</div>

			{/* Content Wrapper */}
			<div className="relative z-30 h-full flex flex-col justify-end">
				<div className="max-w-[1600px] mx-auto px-6 md:px-12 w-full pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">

					{/* Main Info Section */}
					<div className="lg:col-span-8 flex flex-col items-start gap-6">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentIndex}
								initial={{ opacity: 0, x: -30 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.6, ease: "easeOut" }}
								className="space-y-6"
							>
								{/* Type/Badge */}
								<div className="flex items-center gap-3">
									<span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-md text-white/80 text-xs font-black uppercase tracking-widest border border-white/10">
										{current.type}
									</span>
									<div className="flex items-center gap-1 text-yellow-500">
										<Star className="w-4 h-4 fill-current" />
										<span className="font-bold text-sm tracking-tighter">{current.rating || "8.4"}</span>
									</div>
								</div>

								{/* Cinematic Title */}
								<h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl uppercase">
									{current.title.split(' ').map((word, i) => (
										<span key={i} className="inline-block mr-4">
											{word}
										</span>
									))}
								</h1>

								{/* Metadata Row */}
								<div className="flex items-center gap-6 text-white/60 font-medium">
									<span className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
										{current.releaseYear}
									</span>
									<span className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
										{current.duration} min
									</span>
									<div className="hidden md:flex gap-2">
										{current.genres.slice(0, 3).map((g) => (
											<span key={g.genre.id} className="text-white/40 hover:text-white transition-colors cursor-default capitalize italic">
												#{g.genre.name}
											</span>
										))}
									</div>
								</div>

								{/* Description - high legibility */}
								<p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed font-light line-clamp-2 italic border-l-2 border-white/20 pl-6">
									{current.description}
								</p>

								{/* Action Area */}
								<div className="flex items-center gap-4 pt-4 pointer-events-auto">
									<Link
										to="/movies/$movieId"
										params={{ movieId: current.id.toString() }}
										className="h-16 px-10 flex items-center bg-white text-black hover:bg-white/90 rounded-2xl font-black text-xl group transition-all transform hover:scale-105 active:scale-95"
									>
										<Play className="w-6 h-6 mr-3 fill-black transition-transform group-hover:scale-110" />
										WATCH NOW
									</Link>

									<Link
										to="/movies/$movieId"
										params={{ movieId: current.id.toString() }}
										className="h-16 px-8 flex items-center bg-white/5 backdrop-blur-3xl border border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold text-lg group transition-all active:scale-95"
									>
										DETAILS
									</Link>

									<div className="flex items-center gap-2 ml-4">
										<AddButton className="h-16 w-16 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 transition-transform active:scale-90" />
										<Button
											variant="ghost"
											onClick={() => setIsMuted(!isMuted)}
											className="h-16 w-16 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 text-white hover:bg-white/10 active:scale-90"
										>
											{isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
										</Button>
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Navigation Thumbnails (Desktop Only) */}
					<div className="hidden lg:col-span-4 lg:flex flex-col gap-4">
						<div className="flex justify-between items-center text-white/40 text-xs font-bold uppercase tracking-widest pl-2">
							<span>Up Next</span>
							<span>{currentIndex + 1} / {latestData.length}</span>
						</div>
						<div className="flex flex-col gap-3">
							<AnimatePresence mode="popLayout" initial={false}>
								{latestData
									.map((_, i) => (currentIndex + i) % latestData.length)
									.slice(0, 4)
									.map((idx, position) => {
										const movie = latestData[idx];
										return (
											<motion.button
												key={movie.id}
												layout
												initial={{ opacity: 0, x: 20 }}
												animate={{
													opacity: position === 0 ? 1 : 0.6 - (position * 0.1),
													x: position === 0 ? 12 : 0,
													scale: position === 0 ? 1.05 : 1
												}}
												exit={{ opacity: 0, x: -20 }}
												onClick={() => setCurrentIndex(idx)}
												className={`group relative h-20 rounded-xl overflow-hidden flex items-center transition-all ${position === 0
														? 'ring-2 ring-white/40 bg-white/10 shadow-2xl'
														: 'hover:opacity-100'
													}`}
											>
												<div className="w-16 h-full p-2">
													<img
														src={movie.thumbnail}
														className="w-full h-full object-cover rounded-md"
													/>
												</div>
												<div className="flex-1 px-4 text-left">
													<div className="text-white font-black text-xs uppercase truncate leading-none mb-1">
														{movie.title}
													</div>
													<div className="text-white/40 text-[9px] font-bold uppercase">
														{movie.releaseYear} • {movie.genres[0]?.genre.name}
													</div>
												</div>
												{position === 0 && (
													<div className="absolute bottom-0 left-0 h-1 bg-white/40 w-full">
														<motion.div
															key={idx}
															initial={{ width: "0%" }}
															animate={{ width: "100%" }}
															transition={{ duration: 8, ease: "linear" }}
															className="h-full bg-white"
														/>
													</div>
												)}
											</motion.button>
										);
									})}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>

			{/* Scroll indicator with bounce */}
			<motion.div
				animate={{ y: [0, 8, 0] }}
				transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
			>
				<div className="w-px h-12 bg-linear-to-b from-white to-transparent opacity-20" />
				<div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5 font-bold uppercase text-[10px] text-white/40">
					<motion.div
						animate={{ y: [0, 16, 0], opacity: [0, 1, 0] }}
						transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
						className="w-1 h-2 bg-white rounded-full"
					/>
				</div>
			</motion.div>

			{/* Bottom decorative mask */}
			<div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
		</div>
	);
}
