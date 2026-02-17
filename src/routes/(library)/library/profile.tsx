import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	Bookmark,
	Clock,
	Heart,
	Loader2,
	LogOut,
	Play,
	Settings,
	Star,
} from "lucide-react";
import { fadeInUp, MotionPage } from "@/components/motion/motion-page.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLibraryDashboard } from "@/hooks/useLibrary";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(library)/library/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const { data: session, isPending: sessionLoading } = useSession();
	const { data: dashboard, isLoading: dashboardLoading } =
		useLibraryDashboard();

	const user = session?.user;
	const stats = dashboard?.data;

	const isLoading = sessionLoading || dashboardLoading;

	const statCards = [
		{
			label: "Favorites",
			count: stats?.favoritesCount ?? 0,
			icon: Heart,
			color: "text-rose-400",
			bg: "bg-rose-500/10",
			href: "/library/liked",
		},
		{
			label: "Watchlist",
			count: stats?.watchlistCount ?? 0,
			icon: Bookmark,
			color: "text-blue-400",
			bg: "bg-blue-500/10",
			href: "/library/saved",
		},
		{
			label: "History",
			count: stats?.historyCount ?? 0,
			icon: Clock,
			color: "text-purple-400",
			bg: "bg-purple-500/10",
			href: "/library/history",
		},
		{
			label: "Reviews",
			count: stats?.reviewsCount ?? 0,
			icon: Star,
			color: "text-amber-400",
			bg: "bg-amber-500/10",
			href: "/library/history",
		},
	];

	const planLabel =
		user?.subscriptionStatus === "PREMIUM"
			? "Premium"
			: user?.subscriptionStatus === "FAMILY"
				? "Family"
				: "Free";

	const handleLogout = async () => {
		await signOut({
			fetchOptions: { onSuccess: () => window.location.replace("/") },
		});
	};

	if (isLoading) {
		return (
			<MotionPage className="pb-20 flex items-center justify-center min-h-[60vh]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</MotionPage>
		);
	}

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
							src={
								user?.image ||
								`https://avatar.vercel.sh/${user?.email}`
							}
							alt={user?.name ?? "User"}
							className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-1 ring-white/10 shadow-2xl"
						/>
					</motion.div>

					{/* Info */}
					<div className="text-center md:text-left">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="flex items-center justify-center md:justify-start gap-3 mb-2"
						>
							<h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase italic">
								{user?.name || "User"}
							</h1>
							<div className="px-2 py-0.5 rounded bg-primary/20 border border-primary/30">
								<span className="text-[10px] font-black text-primary uppercase tracking-widest">
									{planLabel}
								</span>
							</div>
						</motion.div>
						<p className="text-muted-foreground font-medium mb-4">
							{user?.email}
						</p>
						<div className="flex items-center justify-center md:justify-start gap-2 text-[11px] text-muted-foreground/60 font-bold uppercase tracking-widest">
							<Clock className="w-3 h-3" />
							Vibing since{" "}
							{stats?.memberSince
								? new Date(stats.memberSince).toLocaleDateString(
									"en-US",
									{ month: "long", year: "numeric" },
								)
								: "—"}
						</div>
					</div>

					{/* Actions */}
					<div className="md:ml-auto flex gap-3">
						<Button
							variant="secondary"
							className="rounded-full px-6 bg-white/5 hover:bg-white/10 border-white/5 gap-2"
							asChild
						>
							<Link to="/library/setting">
								<Settings className="w-4 h-4" />
								Settings
							</Link>
						</Button>
						<Button
							variant="ghost"
							className="rounded-full text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 gap-2"
							onClick={handleLogout}
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
					{statCards.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Link to={stat.href}>
									<Card className="bg-zinc-900/40 border-white/5 hover:border-white/10 transition-colors rounded-[2rem] overflow-hidden cursor-pointer group">
										<CardContent className="p-6">
											<div className="flex flex-col gap-4">
												<div
													className={cn(
														"w-12 h-12 rounded-2xl flex items-center justify-center",
														stat.bg,
													)}
												>
													<Icon
														className={cn(
															"w-6 h-6",
															stat.color,
														)}
													/>
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
								</Link>
							</motion.div>
						);
					})}
				</div>
			</section>

			{/* Content Tabs */}
			<Tabs defaultValue="favorites" className="mb-12">
				<div className="flex items-center justify-between mb-8 border-b border-white/5 pb-2">
					<TabsList className="bg-transparent h-auto p-0 gap-8">
						{[
							{ key: "favorites", label: "Recent Favorites" },
							{ key: "watchlist", label: "Recent Watchlist" },
							{ key: "history", label: "Recent History" },
						].map((tab) => (
							<TabsTrigger
								key={tab.key}
								value={tab.key}
								className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all font-black uppercase text-[12px] tracking-[0.2em]"
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<TabsContent value="favorites">
					<MediaGrid
						items={stats?.recentFavorites}
						emptyIcon={
							<Heart className="w-12 h-12 text-muted-foreground/20" />
						}
						emptyText="No favorites yet. Start exploring and tap the heart icon!"
						viewAllHref="/library/liked"
					/>
				</TabsContent>

				<TabsContent value="watchlist">
					<MediaGrid
						items={stats?.recentWatchlist}
						emptyIcon={
							<Bookmark className="w-12 h-12 text-muted-foreground/20" />
						}
						emptyText="Your watchlist is empty. Save items to watch later!"
						viewAllHref="/library/saved"
					/>
				</TabsContent>

				<TabsContent value="history">
					<HistoryGrid
						items={stats?.recentHistory}
						emptyIcon={
							<Clock className="w-12 h-12 text-muted-foreground/20" />
						}
						emptyText="No viewing history yet. Start watching something!"
						viewAllHref="/library/history"
					/>
				</TabsContent>
			</Tabs>
		</MotionPage>
	);
}

// ─── Reusable Components ────────────────────────────────────────────────────

interface MediaItem {
	id: string;
	title: string;
	thumbnail: string;
	type: string;
}

function MediaGrid({
	items,
	emptyIcon,
	emptyText,
	viewAllHref,
}: {
	items: MediaItem[] | undefined;
	emptyIcon: React.ReactNode;
	emptyText: string;
	viewAllHref: string;
}) {
	if (!items || items.length === 0) {
		return (
			<div className="py-20 text-center">
				<div className="mx-auto mb-4 flex justify-center">
					{emptyIcon}
				</div>
				<p className="text-muted-foreground font-medium italic">
					{emptyText}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
				{items.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						whileHover={{ y: -5 }}
						className="group cursor-pointer"
					>
						<div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-2xl bg-zinc-900">
							<img
								src={item.thumbnail}
								alt={item.title}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-glow">
									<Play
										className="w-6 h-6"
										fill="currentColor"
									/>
								</div>
							</div>
							<div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
								<span className="text-[9px] font-black uppercase tracking-widest text-white/80">
									{item.type}
								</span>
							</div>
						</div>
						<p className="font-black text-[13px] tracking-tight truncate leading-tight">
							{item.title}
						</p>
					</motion.div>
				))}
			</div>
			<div className="text-center">
				<Button
					variant="link"
					className="text-primary font-black uppercase tracking-widest text-[10px]"
					asChild
				>
					<Link to={viewAllHref}>View All</Link>
				</Button>
			</div>
		</div>
	);
}

function HistoryGrid({
	items,
	emptyIcon,
	emptyText,
	viewAllHref,
}: {
	items:
	| Array<{
		id: string;
		mediaId: string;
		progress: number;
		completed: boolean;
		viewedAt: string;
		media: MediaItem;
	}>
	| undefined;
	emptyIcon: React.ReactNode;
	emptyText: string;
	viewAllHref: string;
}) {
	if (!items || items.length === 0) {
		return (
			<div className="py-20 text-center">
				<div className="mx-auto mb-4 flex justify-center">
					{emptyIcon}
				</div>
				<p className="text-muted-foreground font-medium italic">
					{emptyText}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
				{items.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						whileHover={{ y: -5 }}
						className="group cursor-pointer"
					>
						<div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-2xl bg-zinc-900">
							<img
								src={item.media.thumbnail}
								alt={item.media.title}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							{!item.completed && item.progress > 0 && (
								<div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
									<div
										className="h-full bg-primary"
										style={{
											width: `${item.progress}%`,
										}}
									/>
								</div>
							)}
							{item.completed && (
								<div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500/80 backdrop-blur-sm">
									<span className="text-[9px] font-black uppercase tracking-widest text-white">
										Watched
									</span>
								</div>
							)}
							<div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
								<span className="text-[9px] font-black uppercase tracking-widest text-white/80">
									{item.media.type}
								</span>
							</div>
						</div>
						<p className="font-black text-[13px] tracking-tight truncate leading-tight">
							{item.media.title}
						</p>
						<p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
							{new Date(item.viewedAt).toLocaleDateString()}
						</p>
					</motion.div>
				))}
			</div>
			<div className="text-center">
				<Button
					variant="link"
					className="text-primary font-black uppercase tracking-widest text-[10px]"
					asChild
				>
					<Link to={viewAllHref}>View All</Link>
				</Button>
			</div>
		</div>
	);
}