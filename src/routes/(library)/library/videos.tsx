import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
	Sparkles
} from "lucide-react";
import {
	MotionPage,
	staggerContainer
} from "@/components/motion/motion-page.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoItem } from "@/domains/library/components/library-video-item";
import { mockVideos } from "@/domains/library/library-mock-data.ts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(library)/library/videos")({
	component: LibraryVideoPage,
});

function LibraryVideoPage() {
	const categories = ["All", "Documentary", "Music", "Concert", "Tutorial", "Festival", "Education"];

	return (
		<MotionPage className="pb-32 space-y-24">
			{/* --- MAIN CATALOG WITH TABS --- */}
			<section className="space-y-12">
				<Tabs defaultValue="All" className="w-full">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-8">
						<div>
							<div className="flex items-center gap-2 text-primary mb-2">
								<Sparkles className="w-4 h-4" />
								<span className="text-[10px] font-black uppercase tracking-[0.3em]">Discovery</span>
							</div>
							<h2 className="text-5xl font-black text-white tracking-tighter">THE CATALOG</h2>
						</div>

						<TabsList className="bg-zinc-900/80 border border-white/5 p-1.5 rounded-2xl h-16 inline-flex shadow-2xl">
							{categories.map((cat) => (
								<TabsTrigger
									key={cat}
									value={cat}
									className={cn(
										"px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all h-full",
										"data-[state=active]:bg-primary data-[state=active]:text-black"
									)}
								>
									{cat}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<AnimatePresence mode="wait">
						<TabsContent value="All">
							<motion.div
								variants={staggerContainer}
								initial="initial"
								animate="animate"
								className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-x-8 gap-y-16"
							>
								{mockVideos.map((video) => (
									<VideoItem key={video.id} video={video} />
								))}
							</motion.div>
						</TabsContent>
					</AnimatePresence>
				</Tabs>
			</section>
		</MotionPage>
	);
}
