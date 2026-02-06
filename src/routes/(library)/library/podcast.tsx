import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import {
	MotionPage,
	staggerContainer,
} from "@/components/motion/motion-page.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaCard } from "@/domains/library/components/media-card";
import { mockPodcasts } from "@/domains/library/library-mock-data.ts";
import { libraryActions } from "@/domains/library/store/library-actions.ts";

export const Route = createFileRoute("/(library)/library/podcast")({
	component: PodcastsPage,
});

function PodcastsPage() {
	return (
		<MotionPage>
			{/* Header */}
			<section className="mb-8">
				<h1 className="text-4xl font-bold text-foreground mb-2">Podcasts</h1>
				<p className="text-muted-foreground">
					Audio stories and discussions about music and movies
				</p>
			</section>

			{/* Tabs */}
			<Tabs defaultValue="all" className="mb-8">
				<TabsList className="bg-card">
					<TabsTrigger value="all">All Episodes</TabsTrigger>
					<TabsTrigger value="music">🎵 Music</TabsTrigger>
					<TabsTrigger value="movies">🎬 Movies</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="mt-6">
					<motion.div
						variants={staggerContainer}
						initial="initial"
						animate="animate"
						className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
					>
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
					</motion.div>
				</TabsContent>

				<TabsContent value="music" className="mt-6">
					<motion.div
						variants={staggerContainer}
						initial="initial"
						animate="animate"
						className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
					>
						{mockPodcasts
							.filter((p) => p.category === "music")
							.map((podcast) => (
								<MediaCard
									key={podcast.id}
									id={podcast.id}
									title={podcast.title}
									subtitle={podcast.artist}
									image={podcast.cover}
									type="track"
									meta={podcast.genres}
									onPlay={() => libraryActions.playPodcast(podcast)}
								/>
							))}
					</motion.div>
				</TabsContent>

				<TabsContent value="movies" className="mt-6">
					<motion.div
						variants={staggerContainer}
						initial="initial"
						animate="animate"
						className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
					>
						{mockPodcasts
							.filter((p) => p.category === "movies")
							.map((podcast) => (
								<MediaCard
									key={podcast.id}
									id={podcast.id}
									title={podcast.title}
									subtitle={podcast.artist}
									image={podcast.cover}
									type="video"
									meta={podcast.genres}
									onPlay={() => libraryActions.playPodcast(podcast)}
								/>
							))}
					</motion.div>
				</TabsContent>
			</Tabs>

			{/* Shows Section */}
			<section>
				<h2 className="section-header mb-6">Shows</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{[
						"Behind the Music",
						"Cinema Secrets",
						"Groove Sessions",
						"Film Psychology",
						"Underground Sounds",
						"Future Watch",
					].map((show, index) => (
						<motion.div
							key={show}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							whileHover={{ scale: 1.02 }}
							className="glass-card-hover p-6 cursor-pointer"
						>
							<div className="flex items-center gap-4">
								<div
									className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${index % 2 === 0 ? "bg-accent/20" : "bg-secondary/20"
										}`}
								>
									{index % 2 === 0 ? "🎵" : "🎬"}
								</div>
								<div>
									<h3 className="font-semibold text-foreground">{show}</h3>
									<p className="text-sm text-muted-foreground">
										{mockPodcasts.filter((p) => p.show === show).length}{" "}
										episodes
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</section>
		</MotionPage>
	);
}
