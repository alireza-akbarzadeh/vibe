import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Headphones, Loader2, Play, Sparkles } from "lucide-react";
import {
	fadeInUp,
	MotionPage,
	staggerContainer,
} from "@/components/motion/motion-page.tsx";
import { useLatestReleases } from "@/hooks/useLibrary";

export const Route = createFileRoute("/(library)/library/podcast")({
	component: PodcastsPage,
});

function PodcastsPage() {
	const { data: episodesData, isLoading } = useLatestReleases({
		type: "EPISODE",
		limit: 20,
	});

	const episodes = episodesData?.data?.items ?? [];

	return (
		<MotionPage>
			{/* Header */}
			<motion.section
				variants={fadeInUp}
				initial="initial"
				animate="animate"
				className="relative overflow-hidden rounded-2xl bg-linear-to-br from-secondary/30 via-background-elevated to-primary/10 p-8 md:p-12 mb-10"
			>
				<div className="relative z-10">
					<div className="flex items-center gap-2 text-secondary mb-3">
						<Headphones className="w-5 h-5" />
						<span className="text-[10px] font-black uppercase tracking-[0.3em]">
							Audio & Episodes
						</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
						Podcasts & Episodes
					</h1>
					<p className="text-lg text-muted-foreground max-w-xl">
						Audio stories, discussions, and episodic content from
						our catalog.
					</p>
				</div>
				<div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
			</motion.section>

			{isLoading && (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
				</div>
			)}

			{/* Episodes Grid */}
			{!isLoading && episodes.length > 0 && (
				<section>
					<div className="flex items-center gap-3 mb-6">
						<Sparkles className="w-5 h-5 text-primary" />
						<h2 className="section-header">All Episodes</h2>
					</div>
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
					>
						{episodes.map((episode) => (
							<motion.div
								key={episode.id}
								variants={fadeInUp}
								whileHover={{ y: -5 }}
								className="group cursor-pointer"
							>
								<div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900">
									<img
										src={
											episode.thumbnail ||
											"/api/placeholder/400/400"
										}
										alt={episode.title}
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										loading="lazy"
									/>
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl">
											<Play
												className="w-6 h-6"
												fill="currentColor"
											/>
										</div>
									</div>
									<div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
										<span className="text-[9px] font-black uppercase tracking-widest text-white/80">
											EPISODE
										</span>
									</div>
								</div>
								<div className="mt-3 px-1">
									<p className="font-bold text-sm tracking-tight truncate text-foreground group-hover:text-primary transition-colors">
										{episode.title}
									</p>
								</div>
							</motion.div>
						))}
					</motion.div>
				</section>
			)}

			{/* Empty */}
			{!isLoading && episodes.length === 0 && (
				<div className="py-20 text-center">
					<Headphones className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
					<p className="text-muted-foreground font-medium italic">
						No podcast episodes available yet. Check back soon!
					</p>
				</div>
			)}
		</MotionPage>
	);
}
