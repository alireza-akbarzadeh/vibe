import { Play, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "@/components/motion";
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
import { MediaCard } from "./components/media-card";
import { MediaCarousel } from "./components/media-carousel";
import { MediaCarouselSkeleton } from "./components/media-carousel-skeleton";

export const LibraryDomains = () => {
	const { data: latestData, isLoading: latestLoading } = useLatestReleases({
		limit: 8,
	});
	const { data: popularData, isLoading: popularLoading } = usePopularSeries(6);
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
							<span className="gradient-text-primary"> Obsession</span>
						</h1>
						<p className="text-lg text-muted-foreground mb-6">
							Movies, series, and more — all in one seamless experience.
						</p>
						<div className="flex gap-4">
							<Button size="lg" className="gap-2 glow-primary" asChild>
								<Link to="/library/saved">
									<Play className="w-5 h-5" fill="currentColor" />
									My Watchlist
								</Link>
							</Button>
						</div>
					</div>
					<div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
				</motion.div>
			</motion.section>

			{(latestLoading || popularLoading || topRatedLoading) && (
				<div className="space-y-12">
					{latestLoading && <MediaCarouselSkeleton />}
					{popularLoading && <MediaCarouselSkeleton />}
					{topRatedLoading && <MediaCarouselSkeleton />}
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
					<MediaCarousel>
						{latestItems.map((item) => (
							<div key={item.id} className="w-48">
								<MediaCard item={item} />
							</div>
						))}
					</MediaCarousel>
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
							<MediaCard key={item.id} item={item} aspect="video" />
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
					<MediaCarousel>
						{topRatedItems.map((item) => (
							<div key={item.id} className="w-48">
								<MediaCard item={item} />
							</div>
						))}
					</MediaCarousel>
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
