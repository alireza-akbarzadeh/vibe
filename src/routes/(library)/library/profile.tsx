import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	Bookmark,
	BookOpen,
	Clock,
	Film,
	Heart,
	LogOut,
	Music,
	Settings,
	Sparkles,
} from "lucide-react";
import { fadeInUp, MotionPage } from "@/components/motion/motion-page.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettingsModal } from "@/domains/library/components/profile-setting-modal";
import { mockTracks } from "@/domains/library/library-mock-data.ts";
import { useLibraryStore } from "@/domains/library/store/library-store.ts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(library)/library/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const user = useLibraryStore((state) => state.user);
	const likes = useLibraryStore((state) => state.likes);
	const bookmarks = useLibraryStore((state) => state.bookmarks);
	const history = useLibraryStore((state) => state.history);

	const stats = [
		{
			label: "Liked Tracks",
			count: likes.tracks.length,
			icon: Music,
			color: "text-emerald-400",
			bg: "bg-emerald-500/10",
		},
		{
			label: "Liked Videos",
			count: likes.videos.length,
			icon: Film,
			color: "text-rose-400",
			bg: "bg-rose-500/10",
		},
		{
			label: "Saved Blogs",
			count: bookmarks.blogs.length,
			icon: BookOpen,
			color: "text-blue-400",
			bg: "bg-blue-500/10",
		},
		{
			label: "History",
			count: history.tracks.length + history.videos.length,
			icon: Clock,
			color: "text-purple-400",
			bg: "bg-purple-500/10",
		},
	];

	return (
		<MotionPage className="pb-20">
			{/* Profile Header */}
			<motion.section
				variants={fadeInUp}
				initial="initial"
				animate="animate"
				className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900/40 border border-white/5 p-8 md:p-12 mb-8 backdrop-blur-md"
			>
				<div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
					{/* Avatar */}
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2, type: "spring" }}
						className="relative group"
					>
						<div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all" />
						<img
							src={user?.avatar || "https://avatar.vercel.sh/user"}
							alt={user?.name}
							className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-1 ring-white/10 shadow-2xl"
						/>
						<button className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
							<ProfileSettingsModal />
						</button>
					</motion.div>

					{/* Info */}
					<div className="text-center md:text-left">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="flex items-center justify-center md:justify-start gap-3 mb-2"
						>
							<h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase italic">
								{user?.name}
							</h1>
							<div className="px-2 py-0.5 rounded bg-primary/20 border border-primary/30">
								<span className="text-[10px] font-black text-primary uppercase tracking-widest">Pro</span>
							</div>
						</motion.div>
						<p className="text-muted-foreground font-medium mb-4">{user?.email}</p>
						<div className="flex items-center justify-center md:justify-start gap-2 text-[11px] text-muted-foreground/60 font-bold uppercase tracking-widest">
							<Clock className="w-3 h-3" />
							Vibing since {new Date(user?.joinedAt || "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
						</div>
					</div>

					{/* Actions */}
					<div className="md:ml-auto flex gap-3">
						<Button variant="secondary" className="rounded-full px-6 bg-white/5 hover:bg-white/10 border-white/5 gap-2">
							<Sparkles className="w-4 h-4" />
							Edit Profile
						</Button>
						<Button
							variant="ghost"
							className="rounded-full text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 gap-2"
						>
							<LogOut className="w-4 h-4" />
							Log Out
						</Button>
					</div>
				</div>

				{/* Animated Background Blobs */}
				<div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-[100px] animate-pulse" />
				<div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-[100px] animate-pulse" />
			</motion.section>

			{/* Stats Grid */}
			<section className="mb-12">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{stats.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Card className="bg-zinc-900/40 border-white/5 hover:border-white/10 transition-colors rounded-[2rem] overflow-hidden">
									<CardContent className="p-6">
										<div className="flex flex-col gap-4">
											<div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
												<Icon className={cn("w-6 h-6", stat.color)} />
											</div>
											<div>
												<p className="text-3xl font-black tracking-tighter text-foreground tabular-nums">
													{stat.count}
												</p>
												<p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
													{stat.label}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</div>
			</section>

			{/* Content Tabs */}
			<Tabs defaultValue="liked" className="mb-12">
				<div className="flex items-center justify-between mb-8 border-b border-white/5 pb-2">
					<TabsList className="bg-transparent h-auto p-0 gap-8">
						{["liked", "saved", "history"].map((tab) => (
							<TabsTrigger
								key={tab}
								value={tab}
								className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all font-black uppercase text-[12px] tracking-[0.2em]"
							>
								{tab}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent value="liked">
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
						{likes.tracks.length === 0 ? (
							<div className="col-span-full py-20 text-center">
								<Heart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
								<p className="text-muted-foreground font-medium italic">No Liked Content Found</p>
							</div>
						) : (
							/* Your liked items mapping would go here */
							<p className="text-muted-foreground">Liked items rendering...</p>
						)}
					</div>
				</TabsContent>

				<TabsContent value="saved">
					<div className="py-20 text-center">
						<Bookmark className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
						<p className="text-muted-foreground font-medium italic">Your saved bookmarks will appear here.</p>
					</div>
				</TabsContent>

				<TabsContent value="history">
					<div className="py-20 text-center">
						<Clock className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
						<p className="text-muted-foreground font-medium italic">Recently played items will appear here.</p>
					</div>
				</TabsContent>
			</Tabs>

			{/* Recommendation Section */}
			<section>
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-xl font-black tracking-tighter uppercase italic">Recommended For You</h2>
					<Button variant="link" className="text-primary font-black uppercase tracking-widest text-[10px]">View All</Button>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
					{mockTracks.slice(0, 5).map((track, index) => (
						<motion.div
							key={track.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							whileHover={{ y: -5 }}
							className="group cursor-pointer"
						>
							<div className="relative aspect-square mb-3 overflow-hidden rounded-[2rem]">
								<img
									src={track.cover}
									alt={track.title}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-glow">
										<Music className="w-6 h-6" />
									</div>
								</div>
							</div>
							<p className="font-black text-[13px] tracking-tight truncate leading-tight">
								{track.title}
							</p>
							<p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider truncate">
								{track.artist}
							</p>
						</motion.div>
					))}
				</div>
			</section>
		</MotionPage>
	);
}