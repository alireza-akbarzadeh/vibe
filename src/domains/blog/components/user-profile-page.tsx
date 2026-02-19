import { useNavigate } from "@tanstack/react-router"; // Changed from Link for the back button
import { useStore } from "@tanstack/react-store";
import {
	ArrowLeft,
	Bookmark,
	CheckCircle2,
	Clock,
	Edit3,
	Heart,
	History,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { blogStore } from "@/domains/blog/store/blog.store";
import { MOCK_ARTICLES } from "../blog-mock";
import { ArticleCard } from "../components/article-card";

type TabType = "saved" | "liked" | "history";

export function UserProfilePage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<TabType>("saved");

	const bookmarks = useStore(blogStore, (s) => s.bookmarks);
	const likes = useStore(blogStore, (s) => s.likes);
	const finished = useStore(blogStore, (s) => s.finishedArticles);

	const displayArticles = useMemo(() => {
		switch (activeTab) {
			case "saved":
				return MOCK_ARTICLES.filter((a) => bookmarks.includes(a.id));
			case "liked":
				return MOCK_ARTICLES.filter((a) => likes.includes(a.id));
			case "history":
				return MOCK_ARTICLES.filter((a) => finished.includes(a.id));
			default:
				return [];
		}
	}, [activeTab, bookmarks, likes, finished]);

	const stats = [
		{
			label: "Saved",
			value: bookmarks.length,
			icon: Bookmark,
			color: "text-purple-400",
		},
		{
			label: "Liked",
			value: likes.length,
			icon: Heart,
			color: "text-pink-500",
		},
		{
			label: "Read",
			value: finished.length,
			icon: CheckCircle2,
			color: "text-emerald-400",
		},
		{ label: "Streak", value: "4d", icon: Zap, color: "text-orange-500" },
	];

	const tabs = [
		{ id: "saved.tsx", label: "Library", icon: Bookmark },
		{ id: "liked", label: "Likes", icon: Heart },
		{ id: "history", label: "History", icon: History },
	];

	return (
		<div className="min-h-screen bg-[#050505] text-white">
			{/* 1. Floating Back Button - Fixed for Mobile accessibility */}
			<div className="sticky top-0 z-50 p-4 lg:p-8 pointer-events-none">
				<button
					onClick={() => navigate({ to: ".." })} // Navigates back one level
					className="pointer-events-auto group flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl"
				>
					<ArrowLeft
						size={16}
						className="group-hover:-translate-x-1 transition-transform"
					/>
					Back
				</button>
			</div>

			{/* 2. Responsive Header Area */}
			<div className="relative -mt-20 pt-20 pb-12 bg-linear-to-b from-purple-900/10 via-transparent to-transparent border-b border-white/5">
				<div className="max-w-7xl mx-auto px-6 md:px-8">
					<div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
						{/* Avatar with Glow */}
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className="relative group shrink-0"
						>
							<div className="absolute -inset-1 bg-linear-to-tr from-purple-600 to-pink-600 rounded-[2.2rem] blur opacity-40 group-hover:opacity-70 transition duration-500" />
							<div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-[#080808] border-2 border-white/10 overflow-hidden">
								<img
									src="https://i.pravatar.cc/150?u=alireza"
									className="w-full h-full object-cover"
									alt="User"
								/>
							</div>
						</motion.div>

						<div className="flex-1 space-y-2">
							<div className="flex flex-col md:flex-row items-center gap-3">
								<h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
									Alireza
								</h1>
								<span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400">
									Editorial Member
								</span>
							</div>
							<p className="text-neutral-500 text-sm font-medium italic flex items-center justify-center md:justify-start gap-2">
								<Clock size={14} className="text-purple-500" /> Active since Jan
								2024
							</p>
						</div>

						<button className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl">
							<Edit3 size={14} /> Profile Settings
						</button>
					</div>
				</div>
			</div>

			{/* 3. Stats Grid - Responsive grid-cols-2 to grid-cols-4 */}
			<div className="max-w-7xl mx-auto px-6 md:px-8 -mt-6">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
					{stats.map((stat, i) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.1 }}
							className="bg-[#0c0c0c] border border-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] hover:border-white/20 transition-colors"
						>
							<stat.icon size={18} className={`${stat.color} mb-2 md:mb-3`} />
							<div className="text-2xl md:text-3xl font-black">
								{stat.value}
							</div>
							<div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
								{stat.label}
							</div>
						</motion.div>
					))}
				</div>
			</div>

			{/* 4. Content Tabs */}
			<div className="max-w-7xl mx-auto px-6 md:px-8 mt-12 md:mt-16 pb-20">
				<div className="flex items-center gap-6 md:gap-10 border-b border-white/5 mb-8 md:mb-10 overflow-x-auto no-scrollbar scroll-smooth">
					{tabs.map((tab) => (
						<Button
							variant="text"
							key={tab.id}
							onClick={() => setActiveTab(tab.id as TabType)}
							className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
								activeTab === tab.id
									? "text-white"
									: "text-neutral-600 hover:text-neutral-400"
							}`}
						>
							{tab.label}
							{activeTab === tab.id && (
								<motion.div
									layoutId="active-tab"
									className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
								/>
							)}
						</Button>
					))}
				</div>

				{/* 5. Animated Grid Content */}
				<AnimatePresence mode="wait">
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="min-h-[300px]"
					>
						{displayArticles.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
								{displayArticles.map((article, index) => (
									<ArticleCard
										key={article.id}
										article={article}
										index={index}
									/>
								))}
							</div>
						) : (
							<div className="py-20 md:py-32 text-center border border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem] bg-white/[0.01]">
								<div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-800">
									<History size={30} />
								</div>
								<h3 className="text-xl font-bold text-neutral-500 uppercase tracking-tighter">
									Your shelf is empty
								</h3>
								<p className="text-neutral-700 text-xs md:text-sm italic mt-1 px-6">
									{activeTab === "saved"
										? "Found something interesting? Bookmark it to see it here."
										: activeTab === "liked"
											? "Spread some love to articles to populate this list."
											: "Articles you finish reading will automatically appear here."}
								</p>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
