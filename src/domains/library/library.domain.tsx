import { motion } from "framer-motion";
import { Play, Sparkles, TrendingUp } from "lucide-react";
import {
	fadeInUp,
	MotionPage,
	staggerContainer,
} from "@/components/motion/motion-page.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "@/components/ui/link.tsx";
import { MediaCard } from "@/domains/library/components/media-card.tsx";
import {
	mockPodcasts,
	mockTracks,
	mockVideos,
} from "@/domains/library/library-mock-data.ts";
import { libraryActions } from "@/domains/library/store/library-actions.ts";
import { VideoItem } from "./components/library-video-item";

export const LibraryDomains = () => {
	return (
		<MotionPage>
			{/* Hero Section */}
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
							New Release
						</div>
						<h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
							Discover Your Next
							<span className="gradient-text-primary"> Obsession</span>
						</h1>
						<p className="text-lg text-muted-foreground mb-6">
							Music, movies, blogs, and podcasts — all in one seamless
							experience.
						</p>
						<div className="flex gap-4">
							<Button size="lg" className="gap-2 glow-primary" asChild>
								<Link to="/music">
									<Play className="w-5 h-5" fill="currentColor" />
									Start Listening
								</Link>
							</Button>
						</div>
					</div>
					<div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
				</motion.div>
			</motion.section>

			{/* Trending Music */}
			<section className="mb-12">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<TrendingUp className="w-5 h-5 text-accent" />
						<h2 className="section-header">Trending Now</h2>
					</div>
					<Link
						to="/library/music"
						className="text-sm text-primary hover:underline"
					>
						See all
					</Link>
				</div>
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4"
				>
					{mockTracks.slice(0, 5).map((track) => (
						<MediaCard
							key={track.id}
							id={track.id}
							title={track.title}
							subtitle={track.artist}
							image={track.cover}
							type="track"
							meta={track.genre}
							onPlay={() => libraryActions.playTrack(track)}
						/>
					))}
				</motion.div>
			</section>

			{/* Featured Videos */}
			<section className="mb-12">
				<div className="flex items-center justify-between mb-6">
					<h2 className="section-header">Featured Videos</h2>
					<Link
						to="/library/videos"
						className="text-sm text-primary hover:underline"
					>
						See all
					</Link>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{mockVideos.slice(0, 3).map((video) => (
						<VideoItem key={video.id} video={video} />
					))}
				</div>
			</section>

			{/* Podcasts */}
			<section className="mb-12">
				<div className="flex items-center justify-between mb-6">
					<h2 className="section-header">Popular Podcasts</h2>
					<Link
						to="/library/podcast"
						className="text-sm text-primary hover:underline"
					>
						See all
					</Link>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4">
					{mockPodcasts.map((podcast) => (
						<MediaCard
							key={podcast.id}
							id={podcast.id}
							title={podcast.title}
							subtitle={podcast.artist}
							image={podcast.cover}
							type="podcast"
							meta={podcast.genres}
							onPlay={() => libraryActions.playPodcast(podcast)}
						/>
					))}
				</div>
			</section>
		</MotionPage>
	);
};
