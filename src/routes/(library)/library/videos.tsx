import { createFileRoute } from "@tanstack/react-router";
import { Film, Loader2, Play, Sparkles } from "lucide-react";
import { motion } from "@/components/motion";
import {
	fadeInUp,
	MotionPage,
	staggerContainer,
} from "@/components/motion/motion-page.tsx";
import type { MediaItem } from "@/domains/dashboard/movies/media.store";
import { useLatestReleases, usePopularSeries } from "@/hooks/useLibrary";

export const Route = createFileRoute("/(library)/library/videos")({
	component: LibraryVideoPage,
});

function LibraryVideoPage() {
	const { data: moviesData, isLoading: moviesLoading } = useLatestReleases({
		type: "MOVIE",
		limit: 12,
	});
	const { data: episodesData, isLoading: episodesLoading } = useLatestReleases({
		type: "EPISODE",
		limit: 12,
	});
	const { data: seriesData, isLoading: seriesLoading } = usePopularSeries(6);

	const movies = moviesData?.data?.items ?? [];
	const episodes = episodesData?.data?.items ?? [];
	const series = seriesData?.data ?? [];
	const isLoading = moviesLoading || episodesLoading || seriesLoading;

	return (
		<MotionPage className="pb-32 space-y-16">
			{/* Hero */}
			<motion.section
				variants={fadeInUp}
				initial="initial"
				animate="animate"
				className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/30 via-background-elevated to-accent/10 p-8 md:p-12"
			>
				<div className="relative z-10">
					<div className="flex items-center gap-2 text-primary mb-3">
						<Sparkles className="w-4 h-4" />
						<span className="text-[10px] font-black uppercase tracking-[0.3em]">
							Discovery
						</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
						Video Catalog
					</h1>
					<p className="text-lg text-muted-foreground max-w-xl">
						Movies, episodes, and series — all in one place.
					</p>
				</div>
				<div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
			</motion.section>

			{isLoading && (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
				</div>
			)}

			{/* Movies Section */}
			{!isLoading && movies.length > 0 && (
				<section>
					<div className="flex items-center gap-3 mb-6">
						<Film className="w-5 h-5 text-primary" />
						<h2 className="section-header">Movies</h2>
					</div>
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
					>
						{movies.map((movie) => (
							<VideoCard key={movie.id} item={movie} />
						))}
					</motion.div>
				</section>
			)}

			{/* Episodes Section */}
			{!isLoading && episodes.length > 0 && (
				<section>
					<div className="flex items-center gap-3 mb-6">
						<Sparkles className="w-5 h-5 text-accent" />
						<h2 className="section-header">Episodes</h2>
					</div>
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
					>
						{episodes.map((ep) => (
							<VideoCard key={ep.id} item={ep} />
						))}
					</motion.div>
				</section>
			)}

			{/* Popular Series */}
			{!isLoading && series.length > 0 && (
				<section>
					<div className="flex items-center gap-3 mb-6">
						<Sparkles className="w-5 h-5 text-secondary" />
						<h2 className="section-header">Popular Series</h2>
					</div>
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6"
					>
						{series.map((s: MediaItem) => (
							<motion.div
								key={s.id}
								variants={fadeInUp}
								whileHover={{ y: -4 }}
								className="group cursor-pointer"
							>
								<div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-900">
									<img
										src={s.thumbnail || "/api/placeholder/600/340"}
										alt={s.title}
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										loading="lazy"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
									<div className="absolute bottom-4 left-4 right-4">
										<p className="font-bold text-white text-lg truncate">
											{s.title}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</section>
			)}

			{/* Empty */}
			{!isLoading &&
				movies.length === 0 &&
				episodes.length === 0 &&
				series.length === 0 && (
					<div className="py-20 text-center">
						<Film className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
						<p className="text-muted-foreground font-medium italic">
							No video content available yet.
						</p>
					</div>
				)}
		</MotionPage>
	);
}

function VideoCard({ item }: { item: MediaItem }) {
	return (
		<motion.div
			variants={fadeInUp}
			whileHover={{ y: -5 }}
			className="group cursor-pointer"
		>
			<div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-900">
				<img
					src={item.thumbnail || "/api/placeholder/600/340"}
					alt={item.title}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
					<div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl">
						<Play className="w-6 h-6" fill="currentColor" />
					</div>
				</div>
				<div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
					<span className="text-[9px] font-black uppercase tracking-widest text-white/80">
						{item.type || "VIDEO"}
					</span>
				</div>
			</div>
			<div className="mt-3 px-1">
				<p className="font-bold text-sm tracking-tight truncate text-foreground group-hover:text-primary transition-colors">
					{item.title}
				</p>
			</div>
		</motion.div>
	);
}
