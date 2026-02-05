import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
	Flame,
	Play, PlayCircle, Sparkles,
	TrendingUp
} from "lucide-react";
import type { ComponentProps } from "react";
import {
	fadeInUp,
	MotionPage,
	staggerContainer
} from "@/components/motion/motion-page.tsx";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockVideos } from "@/domains/library/library-mock-data.ts";
import type { Video } from "@/domains/library/store/library-store-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(library)/library/videos")({
	component: LibraryVideoPage,
});

function LibraryVideoPage() {
	const categories = ["All", "Documentary", "Music", "Concert", "Tutorial", "Festival", "Education"];
	const genres = ["Sci-Fi", "Noir", "Cyberpunk", "Indie", "Retro", "Experimental", "Orchestral"];
	const featuredVideo = mockVideos[0];

	return (
		<MotionPage className="pb-32 space-y-24">
			{/* --- CINEMATIC HERO SECTION --- */}
			<section className="relative h-[80vh] w-full overflow-hidden rounded-[3.5rem] group border border-white/5">
				<div className="absolute inset-0">
					<img
						src={featuredVideo.poster_path.replace('w=400&h=225', 'w=1920&h=1080')}
						className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
						alt=""
					/>
					<div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
					<div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-transparent to-transparent" />
				</div>

				<div className="relative h-full flex flex-col justify-end p-12 md:p-24 space-y-8">
					<motion.div variants={fadeInUp} className="flex items-center gap-4">
						<div className="flex items-center gap-2 bg-primary/20 text-primary text-[10px] font-black px-4 py-1.5 rounded-full border border-primary/30 uppercase tracking-widest backdrop-blur-md">
							<Flame className="w-3 h-3 fill-current" /> Trending Now
						</div>
						<span className="text-white/40 text-[10px] font-black uppercase tracking-widest">S1 E4 • 4K HDR</span>
					</motion.div>

					<motion.h1
						variants={fadeInUp}
						className="text-6xl md:text-8xl font-black text-white max-w-4xl leading-[0.85] tracking-tighter"
					>
						{featuredVideo.title}
					</motion.h1>

					<motion.div variants={fadeInUp} className="flex items-center gap-6">
						<Button className="bg-white text-black hover:bg-white/90 rounded-2xl px-10 h-16 text-sm font-black uppercase tracking-widest gap-3 shadow-2xl shadow-white/10">
							<PlayCircle className="w-6 h-6 fill-current" /> Start Watching
						</Button>
						<Button variant="outline" className="rounded-2xl px-10 h-16 border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 text-sm font-black uppercase tracking-widest">
							<Plus className="w-5 h-5 mr-2" /> My List
						</Button>
					</motion.div>
				</div>
			</section>

			{/* --- GENRE CLOUD --- */}
			<section className="px-4">
				<div className="flex flex-wrap justify-center gap-3">
					{genres.map((genre, i) => (
						<motion.button
							key={genre}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}
							className="px-6 py-3 rounded-2xl bg-zinc-900/50 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95"
						>
							{genre}
						</motion.button>
					))}
				</div>
			</section>

			{/* --- TRENDING VERTICAL POSTERS --- */}
			<section className="space-y-8">
				<div className="flex items-center justify-between px-2">
					<div className="flex items-center gap-3">
						<TrendingUp className="w-6 h-6 text-primary" />
						<h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Trending This Week</h2>
					</div>
					<button className="text-[10px] font-black text-white/40 hover:text-white transition-colors tracking-[0.2em]">VIEW ALL</button>
				</div>

				<div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-2">
					{mockVideos.map((video, i) => (
						<motion.div
							key={`poster-${video.id}`}
							className="min-w-60 md:min-w-70 group cursor-pointer"
							whileHover={{ y: -10 }}
						>
							<div className="relative aspect-2/3 rounded-[2.5rem] overflow-hidden border border-white/10 mb-4">
								<img src={video.poster_path} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" alt="" />
								<div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white border border-white/10">
									TOP {i + 1}
								</div>
								<div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
							</div>
							<h3 className="text-md font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">{video.title}</h3>
							<p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{video.category}</p>
						</motion.div>
					))}
				</div>
			</section>

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
								className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
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

function VideoItem({ video }: { video: Video }) {
	return (
		<motion.div variants={fadeInUp} className="group cursor-pointer">
			<div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-6 border border-white/5 bg-zinc-900 shadow-2xl">
				<img src={video.poster_path} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
				<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
					<div className="size-16 rounded-full bg-white flex items-center justify-center text-black shadow-3xl">
						<Play className="w-6 h-6 fill-current ml-1" />
					</div>
				</div>
			</div>
			<div className="space-y-3 px-1">
				<div className="flex items-center gap-2">
					<span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
						{video.category}
					</span>
					<span className="text-[9px] font-black text-white/30 uppercase">{video.duration} min</span>
				</div>
				<h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight">{video.title}</h3>
				<div className="flex items-center gap-3 pt-1">
					<img src={video.channelAvatar} className="size-6 rounded-full border border-white/10" alt="" />
					<span className="text-xs font-bold text-white/40 tracking-tight">{video.channel}</span>
				</div>
			</div>
		</motion.div>
	);
}

function Plus(props: ComponentProps<"svg">) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<title>puls</title>
			<line x1="12" y1="5" x2="12" y2="19"></line>
			<line x1="5" y1="12" x2="19" y2="12"></line>
		</svg>
	);
}