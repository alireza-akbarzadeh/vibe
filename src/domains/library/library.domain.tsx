import { motion } from "framer-motion";
import { Loader2, Play, Sparkles, TrendingUp } from "lucide-react";
import {
	fadeInUp,
	MotionPage,
	staggerContainer,
} from "@/components/motion/motion-page.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "@/components/ui/link.tsx";
import {
	useLatestReleases,
	usePopularSeries,
	useTopRated,
} from "@/hooks/useLibrary";

export const LibraryDomains = () => {
	const { data: latestData, isLoading: latestLoading } = useLatestReleases({
		limit: 8,
	});
	const { data: popularData, isLoading: popularLoading } =
		usePopularSeries(6);
	const { data: topRatedData, isLoading: topRatedLoading } = useTopRated({
		limit: 8,
	});

	const latestItems = latestData?.data?.items ?? [];
	const popularItems = popularData?.data?.items ?? [];
	const topRatedItems = topRatedData?.data?.items ?? [];

	const isLoading = latestLoading && popularLoading && topRatedLoading;

	return (
		<MotionPage>
			{/* Hero */}
			<motion.section
				variants={staggerContainer}
				initial="initial"
				animate="animate"
				className="mb-12"
			>
				<motion.div
					variants={fadeInUp}
					className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/20 via-background-elevated to-secondary/20 p-8 md:p-12"
				>
					<div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent" />
					<div className="relative z-10 max-w-2xl">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
							<Sparkles className="w-4 h-4" />
							Your Library
						</div>
						<h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
							Discover Your Next
							<span className="gradient-text-primary">
								{" "}
								Obsession
							</span>
						</h1>
						<p className="text-lg text-muted-foreground mb-6">
							Movies, series, and more — all in one seamless
							experience.
						</p>
						<div className="flex gap-4">
							<Button
								size="lg"
								className="gap-2 glow-primary"
								asChild
							>
								<Link to="/library/saved">
									<Play
										className="w-5 h-5"
										fill="currentColor"
									/>
									My Watchlist
								</Link>
							</Button>
						</div>
					</div>
					<div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
				</motion.div>
			</motion.section>

			{isLoading && (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
				</div>
			)}

			{/* Latest Releases */}
			{latestItems.length > 0 && (
				<section className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<Sparkles className="w-5 h-5 text-primary" />
							<h2 className="section-header">Latest Releases</h2>
						</div>
					</div>
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
					>
						{latestItems.map((item) => (
							<ContentCard key={item.id} item={item} />
						))}
					</motion.div>
				</section>
			)}

			{/* Popular Series */}
			{popularItems.length > 0 && (
				<section className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<TrendingUp className="w-5 h-5 text-accent" />
							<h2 className="section-header">Popular Series</h2>
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{popularItems.map((item) => (
							<ContentCard
								key={item.id}
								item={item}
								aspect="video"
							/>
						))}
					</div>
				</section>
			)}

			{/* Top Rated */}
			{topRatedItems.length > 0 && (
				<section className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<h2 className="section-header">Top Rated</h2>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{topRatedItems.map((item) => (
							<ContentCard key={item.id} item={item} />
						))}
					</div>
				</section>
			)}

			{/* Empty state when no content exists */}
			{!isLoading &&
				latestItems.length === 0 &&
				popularItems.length === 0 &&
				topRatedItems.length === 0 && (
					<div className="py-20 text-center">
						<Sparkles className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
						<p className="text-muted-foreground font-medium italic">
							No content available yet. Check back soon!
						</p>
					</div>
				)}
		</MotionPage>
	);
};

// ─── Reusable Content Card ──────────────────────────────────────────────────

function ContentCard({
	item,
	aspect = "portrait",
}: {
	item: { id: string; title: string; thumbnail: string; type: string };
	aspect?: "portrait" | "video";
}) {
	return (
		<motion.div
			variants={fadeInUp}
			whileHover={{ y: -5 }}
			className="group cursor-pointer"
		>
			<div
				className={`relative overflow-hidden rounded-2xl bg-zinc-900 ${aspect === "video" ? "aspect-video" : "aspect-[2/3]"}`}
			>
				<img
					src={item.thumbnail || "/api/placeholder/400/600"}
					alt={item.title}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
					<div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl">
						<Play className="w-6 h-6" fill="currentColor" />
					</div>
				</div>
				<div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
					<span className="text-[9px] font-black uppercase tracking-widest text-white/80">
						{item.type}
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
