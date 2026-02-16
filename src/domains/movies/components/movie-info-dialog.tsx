import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	ChevronRight,
	Info,
	Play,
	Share2,
	Star,
	Volume2
} from "lucide-react";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { LikeButton } from "@/components/buttons/like-button";
import { WatchListButton } from "@/components/buttons/watchlist-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
	movieCastQueryOptions,
	movieDetailsQueryOptions,
	movieImagesQueryOptions,
	movieSimilarQueryOptions,
} from "../movies-details.queries";

interface MovieInfoDialogProps {
	mediaId: string;
	triggerButton?: ReactNode;
}

function MovieInfoContent({ mediaId }: { mediaId: string }) {
	const navigate = useNavigate();

	// Fetch all data
	const { data: media } = useSuspenseQuery(movieDetailsQueryOptions(mediaId));
	const { data: cast } = useSuspenseQuery(movieCastQueryOptions(mediaId));
	const { data: images } = useSuspenseQuery(movieImagesQueryOptions(mediaId));

	const genreIds = media.genres?.map((g) => g.genre.id) || [];
	const { data: similarMovies } = useQuery(movieSimilarQueryOptions(mediaId, genreIds));

	const backdrop = images?.backdrops[0]?.filePath
		? `https://image.tmdb.org/t/p/w1280${images.backdrops[0].filePath}`
		: media.thumbnail;

	return (
		<div className="relative w-full bg-[#050505] overflow-hidden rounded-3xl">
			{/* Cinematic Backdrop */}
			<div className="relative h-112.5 w-full group">
				<motion.div
					initial={{ scale: 1.1, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 1.2, ease: "easeOut" }}
					className="absolute inset-0"
				>
					<img
						src={backdrop}
						alt={media.title}
						className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/40 to-transparent" />
					<div className="absolute inset-0 bg-linear-to-r from-[#050505] via-transparent to-transparent" />
				</motion.div>

				{/* Floating Header Actions */}
				<div className="absolute top-6 right-6 flex items-center gap-3 z-20">
					<Button
						size="icon"
						variant="ghost"
						className="rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20"
					>
						<Volume2 className="w-5 h-5 text-white" />
					</Button>
				</div>

				{/* Hero Content Overlay */}
				<div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.8 }}
					>
						<div className="flex items-center gap-3 mb-4">
							<Badge className="bg-purple-600 text-white font-black px-3 py-1 uppercase tracking-tighter italic">
								{media.releaseYear}
							</Badge>
							<div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
								<Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
								<span className="text-sm font-black text-white">{media.averageRating?.toFixed(1) || "8.4"}</span>
							</div>
							<span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
								{media.duration}
							</span>
						</div>

						<h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.8] mb-6 drop-shadow-2xl">
							{media.title}
						</h2>

						<div className="flex flex-wrap items-center gap-4">
							<Button
								size="lg"
								className="bg-white hover:bg-gray-200 text-black font-black uppercase tracking-tighter rounded-xl px-10 h-14 group transition-all active:scale-95"
								onClick={() => navigate({ to: "/movies/$movieId", params: { movieId: mediaId } })}
							>
								<Play className="w-5 h-5 fill-black mr-2 transition-transform group-hover:scale-110" />
								Watch Now
							</Button>

							<div className="flex items-center gap-2">
								{/* Next-Gen Reusable Buttons */}
								<WatchListButton mediaId={mediaId} variant="icon" />

								<LikeButton mediaId={mediaId} iconSize="medium" />

								<Button
									variant="outline"
									size="icon"
									className="w-14 h-14 rounded-xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 group active:scale-95 transition-all"
								>
									<Share2 className="w-6 h-6 text-white group-hover:text-purple-400 transition-colors" />
								</Button>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Detailed Info Grid */}
			<div className="px-8 md:px-12 pb-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
					{/* Main Content */}
					<div className="lg:col-span-8 space-y-12">
						{/* Synopsis Section */}
						<motion.section
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							className="space-y-4"
						>
							<div className="flex items-center gap-2">
								<div className="h-px w-8 bg-purple-500" />
								<span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Synopsis</span>
							</div>
							<p className="text-xl text-white/70 leading-relaxed font-medium tracking-tight line-clamp-4 hover:line-clamp-none transition-all duration-500">
								{media.description}
							</p>
							<div className="flex flex-wrap gap-2 pt-2">
								{media.genres?.map((g) => (
									<Badge
										key={g.genre.id}
										variant="outline"
										className="bg-white/5 border-white/10 text-white/40 hover:text-white transition-colors py-1 cursor-default"
									>
										{g.genre.name}
									</Badge>
								))}
							</div>
						</motion.section>

						{/* Cast Snippet */}
						<section className="space-y-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-px w-8 bg-purple-500" />
									<span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Main Cast</span>
								</div>
							</div>
							<div className="flex -space-x-4 overflow-hidden">
								{cast?.actors.slice(0, 8).map((actor, i) => (
									<motion.div
										key={actor.person.id}
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.1 * i }}
										className="relative"
									>
										<img
											src={actor.person.profilePath ? `https://image.tmdb.org/t/p/w185${actor.person.profilePath}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${actor.person.name}`}
											alt={actor.person.name}
											className="w-16 h-16 rounded-full border-4 border-black object-cover"
										/>
									</motion.div>
								))}
								<div className="w-16 h-16 rounded-full border-4 border-black bg-white/5 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white/50">
									+{cast?.actors.length || 0}
								</div>
							</div>
						</section>
					</div>

					{/* Side Content / Stats */}
					<div className="lg:col-span-4 space-y-10">
						{/* Stats Vertical Bar */}
						<div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-8">
							<div className="flex flex-col gap-1">
								<span className="text-[10px] font-black uppercase tracking-widest text-white/30">Director</span>
								<span className="text-lg font-black italic uppercase text-white tracking-tighter">
									{cast?.directors[0]?.person.name || "Ridley Scott"}
								</span>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<div className="flex flex-col gap-1">
									<span className="text-[10px] font-black uppercase tracking-widest text-white/30">Language</span>
									<span className="text-sm font-bold text-white uppercase">English</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-[10px] font-black uppercase tracking-widest text-white/30">Rating</span>
									<span className="text-sm font-bold text-white uppercase">R-Rated</span>
								</div>
							</div>

							<div className="h-px bg-white/10" />

							<div className="space-y-4">
								<span className="text-[10px] font-black uppercase tracking-widest text-white/30">Atmosphere</span>
								<div className="flex gap-4">
									<div className="flex-1 flex items-center justify-center h-16 rounded-2xl bg-white/5 border border-white/10">
										<Volume2 className="w-6 h-6 text-purple-500" />
									</div>
									<div className="flex-1 flex items-center justify-center h-16 rounded-2xl bg-white/5 border border-white/10 italic font-black text-xl text-white">
										4K
									</div>
								</div>
							</div>
						</div>

						{/* Quick Similarity */}
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<div className="h-px w-4 bg-purple-500" />
								<span className="text-[10px] font-black uppercase tracking-widest text-white/40">Similar Records</span>
							</div>
							<div className="grid grid-cols-3 gap-2">
								{similarMovies?.items.slice(0, 3).map((movie) => (
									<div key={movie.id} className="aspect-2/3 bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer group">
										<img src={movie.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
									</div>
								))}
							</div>
						</div>

						<Button
							variant="ghost"
							className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 text-white font-black uppercase tracking-tighter hover:bg-white hover:text-black transition-all group"
							onClick={() => navigate({ to: "/movies/$movieId", params: { movieId: mediaId } })}
						>
							View Full Record
							<ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="h-200 w-full bg-[#050505] p-0 overflow-hidden relative">
			<div className="h-112.5 w-full bg-white/5 animate-pulse" />
			<div className="px-12 py-10 space-y-8">
				<Skeleton className="h-20 w-3/4 bg-white/5" />
				<div className="flex gap-4">
					<Skeleton className="h-14 w-40 bg-white/5 rounded-xl" />
					<Skeleton className="h-14 w-14 bg-white/5 rounded-xl" />
					<Skeleton className="h-14 w-14 bg-white/5 rounded-xl" />
				</div>
				<div className="grid grid-cols-12 gap-12 mt-12">
					<div className="col-span-8 space-y-6">
						<Skeleton className="h-32 w-full bg-white/5" />
						<Skeleton className="h-16 w-1/2 bg-white/5" />
					</div>
					<div className="col-span-4">
						<Skeleton className="h-64 w-full bg-white/5 rounded-3xl" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function MovieInfoDialog(props: MovieInfoDialogProps) {
	const { mediaId, triggerButton } = props;

	return (
		<Dialog>
			<DialogTrigger asChild>
				{triggerButton || (
					<Button
						size="sm"
						variant="ghost"
						className="w-10 h-10 p-0 bg-white/5 hover:bg-white/15 border border-white/5 rounded-xl group"
					>
						<Info className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="p-0 border-white/10 bg-[#050505] max-w-[95vw] md:max-w-7xl max-h-[95vh] overflow-y-auto custom-scrollbar-hidden shadow-2xl">
				<Suspense fallback={<LoadingSkeleton />}>
					<MovieInfoContent mediaId={mediaId} />
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}
