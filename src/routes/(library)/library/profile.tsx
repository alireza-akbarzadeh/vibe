import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Bookmark,
	Camera,
	Check,
	Clock,
	Copy,
	Eye,
	EyeOff,
	Heart,
	KeyRound,
	Loader2,
	LogOut,
	Pencil,
	Play,
	Settings,
	Share2,
	Star,
	X,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "@/components/motion";
import { fadeInUp, MotionPage } from "@/components/motion/motion-page.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLibraryDashboard } from "@/hooks/useLibrary";
import { authClient, changePassword, signOut } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(library)/library/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const { auth: session } = Route.useRouteContext();
	const { data: dashboard, isLoading: dashboardLoading } =
		useLibraryDashboard();

	const user = session?.user;
	const stats = dashboard?.data;

	// Edit name state
	const [isEditingName, setIsEditingName] = useState(false);
	const [editName, setEditName] = useState(user?.name ?? "");
	const [isSavingName, setIsSavingName] = useState(false);

	// Photo upload state
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

	// Password change state
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrentPw, setShowCurrentPw] = useState(false);
	const [showNewPw, setShowNewPw] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// Share state
	const [copiedLink, setCopiedLink] = useState<string | null>(null);

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

	const handleSaveName = async () => {
		if (!editName.trim() || editName.trim() === user?.name) {
			setIsEditingName(false);
			return;
		}
		setIsSavingName(true);
		try {
			await authClient.updateUser({ name: editName.trim() });
			toast.success("Name updated");
			setIsEditingName(false);
			// Reload to reflect the change in context
			window.location.reload();
		} catch {
			toast.error("Failed to update name");
		} finally {
			setIsSavingName(false);
		}
	};

	const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image must be under 5MB");
			return;
		}

		setIsUploadingPhoto(true);
		try {
			const reader = new FileReader();
			reader.onloadend = async () => {
				const base64 = reader.result as string;
				await authClient.updateUser({ image: base64 });
				toast.success("Photo updated");
				window.location.reload();
			};
			reader.readAsDataURL(file);
		} catch {
			toast.error("Failed to upload photo");
			setIsUploadingPhoto(false);
		}
	};

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		setIsChangingPassword(true);
		try {
			await changePassword({ currentPassword, newPassword });
			toast.success("Password changed successfully");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setShowPasswordForm(false);
		} catch {
			toast.error("Current password is incorrect");
		} finally {
			setIsChangingPassword(false);
		}
	};

	const handleShare = async (type: "favorites" | "watchlist") => {
		const shareUrl = `${window.location.origin}/u/${user?.id}/${type}`;
		try {
			if (navigator.share) {
				await navigator.share({
					title: `${user?.name}'s ${type === "favorites" ? "Favorites" : "Watchlist"} on VIBE`,
					url: shareUrl,
				});
			} else {
				await navigator.clipboard.writeText(shareUrl);
				setCopiedLink(type);
				setTimeout(() => setCopiedLink(null), 2000);
				toast.success("Link copied to clipboard");
			}
		} catch {
			// User cancelled share dialog
		}
	};

	const handleLogout = async () => {
		await signOut({
			fetchOptions: { onSuccess: () => window.location.replace("/") },
		});
	};

	if (dashboardLoading) {
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
				className="relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/5 p-8 md:p-12 mb-8 backdrop-blur-md"
			>
				<div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
					{/* Avatar with edit overlay */}
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2, type: "spring" }}
						className="relative group"
					>
						<div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all" />
						<img
							src={user?.image || `https://avatar.vercel.sh/${user?.email}`}
							alt={user?.name ?? "User"}
							className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-1 ring-white/10 shadow-2xl"
						/>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={isUploadingPhoto}
							className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
						>
							{isUploadingPhoto ? (
								<Loader2 className="w-6 h-6 text-white animate-spin" />
							) : (
								<Camera className="w-6 h-6 text-white" />
							)}
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handlePhotoUpload}
							className="hidden"
						/>
					</motion.div>

					{/* Info */}
					<div className="text-center md:text-left flex-1 min-w-0">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="flex items-center justify-center md:justify-start gap-3 mb-2"
						>
							{isEditingName ? (
								<div className="flex items-center gap-2">
									<Input
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleSaveName();
											if (e.key === "Escape") {
												setIsEditingName(false);
												setEditName(user?.name ?? "");
											}
										}}
										className="text-2xl font-black tracking-tighter bg-white/5 border-white/10 rounded-xl h-12 max-w-xs"
										autoFocus
									/>
									<Button
										size="icon"
										variant="ghost"
										onClick={handleSaveName}
										disabled={isSavingName}
										className="rounded-full h-10 w-10 bg-primary/20 hover:bg-primary/30 text-primary cursor-pointer"
									>
										{isSavingName ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Check className="w-4 h-4" />
										)}
									</Button>
									<Button
										size="icon"
										variant="ghost"
										onClick={() => {
											setIsEditingName(false);
											setEditName(user?.name ?? "");
										}}
										className="rounded-full h-10 w-10 hover:bg-white/5 cursor-pointer"
									>
										<X className="w-4 h-4" />
									</Button>
								</div>
							) : (
								<>
									<h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase italic">
										{user?.name || "User"}
									</h1>
									<button
										type="button"
										onClick={() => {
											setEditName(user?.name ?? "");
											setIsEditingName(true);
										}}
										className="p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
									>
										<Pencil className="w-4 h-4" />
									</button>
								</>
							)}
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
								? new Date(stats.memberSince).toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})
								: "—"}
						</div>
					</div>

					{/* Actions */}
					<div className="md:ml-auto flex flex-wrap gap-3 justify-center">
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

				<div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-[100px] animate-pulse" />
				<div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-[100px] animate-pulse" />
			</motion.section>

			{/* Quick Actions — Password & Share */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
				{/* Password Change Card */}
				<Card className="bg-zinc-900/40 border-white/5 rounded-2xl overflow-hidden">
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
									<KeyRound className="w-5 h-5 text-amber-400" />
								</div>
								<div>
									<p className="text-sm font-bold">Password</p>
									<p className="text-xs text-muted-foreground">
										Change your account password
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowPasswordForm(!showPasswordForm)}
								className="rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
							>
								{showPasswordForm ? "Cancel" : "Change"}
							</Button>
						</div>

						<AnimatePresence>
							{showPasswordForm && (
								<motion.form
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
									}}
									onSubmit={handlePasswordChange}
									className="overflow-hidden space-y-3"
								>
									<div>
										<Label className="text-xs text-muted-foreground mb-1 block">
											Current Password
										</Label>
										<div className="relative">
											<Input
												type={showCurrentPw ? "text" : "password"}
												value={currentPassword}
												onChange={(e) => setCurrentPassword(e.target.value)}
												placeholder="••••••••"
												className="bg-white/5 border-white/10 rounded-xl pr-10"
												required
											/>
											<button
												type="button"
												onClick={() => setShowCurrentPw(!showCurrentPw)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
											>
												{showCurrentPw ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</button>
										</div>
									</div>
									<div>
										<Label className="text-xs text-muted-foreground mb-1 block">
											New Password
										</Label>
										<div className="relative">
											<Input
												type={showNewPw ? "text" : "password"}
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												placeholder="Min 8 characters"
												className="bg-white/5 border-white/10 rounded-xl pr-10"
												required
												minLength={8}
											/>
											<button
												type="button"
												onClick={() => setShowNewPw(!showNewPw)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
											>
												{showNewPw ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</button>
										</div>
									</div>
									<div>
										<Label className="text-xs text-muted-foreground mb-1 block">
											Confirm Password
										</Label>
										<Input
											type="password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											placeholder="••••••••"
											className="bg-white/5 border-white/10 rounded-xl"
											required
										/>
									</div>
									<Button
										type="submit"
										disabled={isChangingPassword}
										className="w-full rounded-xl h-10 bg-primary hover:bg-primary/90 font-bold text-sm"
									>
										{isChangingPassword ? (
											<Loader2 className="w-4 h-4 animate-spin mr-2" />
										) : null}
										Update Password
									</Button>
								</motion.form>
							)}
						</AnimatePresence>
					</CardContent>
				</Card>

				{/* Share Card */}
				<Card className="bg-zinc-900/40 border-white/5 rounded-2xl overflow-hidden">
					<CardContent className="p-6">
						<div className="flex items-center gap-3 mb-5">
							<div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
								<Share2 className="w-5 h-5 text-emerald-400" />
							</div>
							<div>
								<p className="text-sm font-bold">Share Your Taste</p>
								<p className="text-xs text-muted-foreground">
									Let friends see your favorites &amp; watchlist
								</p>
							</div>
						</div>

						<div className="space-y-3">
							<button
								type="button"
								onClick={() => handleShare("favorites")}
								className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-all cursor-pointer group"
							>
								<Heart className="w-4 h-4 text-rose-400" />
								<span className="text-sm font-medium flex-1 text-left">
									Share Favorites
								</span>
								{copiedLink === "favorites" ? (
									<Check className="w-4 h-4 text-emerald-400" />
								) : (
									<Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
								)}
							</button>
							<button
								type="button"
								onClick={() => handleShare("watchlist")}
								className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-all cursor-pointer group"
							>
								<Bookmark className="w-4 h-4 text-blue-400" />
								<span className="text-sm font-medium flex-1 text-left">
									Share Watchlist
								</span>
								{copiedLink === "watchlist" ? (
									<Check className="w-4 h-4 text-emerald-400" />
								) : (
									<Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
								)}
							</button>
							<p className="text-[10px] text-muted-foreground/50 text-center pt-1">
								Anyone with the link can view your public lists
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

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
									<Card className="bg-zinc-900/40 border-white/5 hover:border-white/10 transition-colors rounded-2xl overflow-hidden cursor-pointer group">
										<CardContent className="p-6">
											<div className="flex flex-col gap-4">
												<div
													className={cn(
														"w-12 h-12 rounded-2xl flex items-center justify-center",
														stat.bg,
													)}
												>
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
						emptyIcon={<Heart className="w-12 h-12 text-muted-foreground/20" />}
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
						emptyIcon={<Clock className="w-12 h-12 text-muted-foreground/20" />}
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
				<div className="mx-auto mb-4 flex justify-center">{emptyIcon}</div>
				<p className="text-muted-foreground font-medium italic">{emptyText}</p>
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
									<Play className="w-6 h-6" fill="currentColor" />
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
				<div className="mx-auto mb-4 flex justify-center">{emptyIcon}</div>
				<p className="text-muted-foreground font-medium italic">{emptyText}</p>
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
