import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import {
	Bookmark,
	CheckCircle2,
	Clock,
	Eye,
	Heart,
	Share2,
	Sparkles,
	TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import type { FeatureArticle, Rating } from "../blog-mock";
import { actions, blogStore } from "../store/blog.store";

type ArticleCardProps = {
	article: FeatureArticle;
	index: number;
};

const RATING_CONFIG: Record<
	Rating,
	{ emoji: string; color: string; bg: string }
> = {
	"Mind Blown": {
		emoji: "🤯",
		color: "text-yellow-400",
		bg: "bg-yellow-400/10 border-yellow-400/20",
	},
	Lit: {
		emoji: "🔥",
		color: "text-orange-500",
		bg: "bg-orange-500/10 border-orange-500/20",
	},
	Love: {
		emoji: "❤️",
		color: "text-pink-500",
		bg: "bg-pink-500/10 border-pink-500/20",
	},
	Interesting: {
		emoji: "🧐",
		color: "text-blue-400",
		bg: "bg-blue-400/10 border-blue-400/20",
	},
	Electric: {
		emoji: "⚡",
		color: "text-purple-400",
		bg: "bg-purple-400/10 border-purple-500/20",
	},
};

export function ArticleCard({ article, index }: ArticleCardProps) {
	const navigate = useNavigate();

	const isBookmarked = useStore(blogStore, (s) =>
		s.bookmarks.includes(article.id),
	);
	const isLiked = useStore(blogStore, (s) => s.likes.includes(article.id));
	const isFinished = useStore(blogStore, (s) =>
		s.finishedArticles.includes(article.id),
	);
	const progress = useStore(
		blogStore,
		(s) => s.readingProgress[article.id] || 0,
	);

	const ratingStyle =
		RATING_CONFIG[article.rating as Rating] || RATING_CONFIG["Interesting"];

	const categoryColor =
		article.category.toLowerCase() === "music"
			? "text-blue-400 bg-blue-500/10 border-blue-500/20"
			: article.category.toLowerCase() === "playlists"
				? "text-purple-400 bg-purple-500/10 border-purple-500/20"
				: "text-pink-400 bg-pink-500/10 border-pink-500/20";

	return (
		<motion.div
			layout
			initial={{ opacity: 0, filter: "blur(8px)" }}
			animate={{
				opacity: 1,
				filter: "blur(0px)",
				transition: {
					delay: index * 0.1,
					duration: 0.6,
					ease: [0.21, 0.47, 0.32, 0.98],
				},
			}}
			exit={{ opacity: 0, scale: 0.9 }}
			whileHover={{ y: -8 }}
			onClick={() =>
				navigate({
					to: "/blog/$blogslug",
					params: { blogslug: generateSlug(article.title) },
				})
			}
			className={`group cursor-pointer flex flex-col h-full relative bg-white/2 border border-white/5 rounded-[2rem] p-3 transition-all duration-500 ${
				isFinished
					? "opacity-70 hover:opacity-100"
					: "hover:bg-white/4 hover:border-white/10 shadow-2xl hover:shadow-purple-500/5"
			}`}
		>
			{/* Image Section - Cleaner Badge Layout */}
			<div className="relative aspect-16/11 rounded-3xl overflow-hidden mb-5 bg-neutral-900 shadow-inner">
				<img
					src={article.image}
					alt={article.title}
					className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${isFinished ? "grayscale" : ""}`}
				/>

				<div className="absolute top-3 left-3 flex gap-2 z-30">
					{Number(article?.views) > 5000 && (
						<div className="bg-orange-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
							<TrendingUp size={12} strokeWidth={3} />
							<span className="text-[10px] font-black uppercase tracking-tighter">
								Hot
							</span>
						</div>
					)}
					<div
						className={`px-2.5 py-1 rounded-lg border backdrop-blur-md font-black uppercase tracking-tighter text-[10px] ${categoryColor}`}
					>
						{article.category}
					</div>
				</div>

				{/* Progress bar and Checkmark remain on image as they are state-dependent */}
				<div className="absolute bottom-0 left-0 right-0 z-20">
					<AnimatePresence mode="wait">
						{isFinished ? (
							<motion.div
								initial={{ y: 20 }}
								animate={{ y: 0 }}
								className="bg-emerald-500/90 backdrop-blur-sm py-1.5 flex items-center justify-center gap-1.5"
							>
								<CheckCircle2
									size={12}
									className="text-white"
									strokeWidth={3}
								/>
								<span className="text-[10px] font-black uppercase tracking-widest text-white">
									Completed
								</span>
							</motion.div>
						) : (
							progress > 0 && (
								<div className="h-1.5 w-full bg-white/10 overflow-hidden">
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${progress}%` }}
										className="h-full bg-linear-to-r from-purple-500 to-pink-500"
									/>
								</div>
							)
						)}
					</AnimatePresence>
				</div>

				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						actions.toggleBookmark(article.id);
					}}
					className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-xl border transition-all z-30 ${
						isBookmarked
							? "bg-purple-600 border-purple-400 text-white"
							: "bg-black/20 border-white/10 text-white opacity-0 group-hover:opacity-100 hover:scale-110"
					}`}
				>
					<Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
				</button>
			</div>

			{/* Content Section - New Rating Placement */}
			<div className="px-3 pb-3 flex-1 flex flex-col">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center">
						<div className="flex -space-x-2 mr-3">
							{[1, 2, 3].map((i) => (
								<img
									key={i}
									className="w-6 h-6 rounded-full border-2 border-[#050505] object-cover"
									src={`https://i.pravatar.cc/100?img=${i + 22}`}
									alt="reader"
								/>
							))}
						</div>
						<span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
							+2.4k Reading
						</span>
					</div>

					{/* Integrated Rating Pill in Body */}
					<div
						className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors duration-300 ${ratingStyle.bg}`}
					>
						<span className="text-[10px] leading-none">
							{ratingStyle.emoji}
						</span>
						<span
							className={`text-[9px] font-black uppercase tracking-widest ${ratingStyle.color}`}
						>
							{article.rating}
						</span>
					</div>
				</div>

				<h3
					className={`text-xl font-bold mb-2 leading-tight transition-all duration-300 ${
						isFinished
							? "text-neutral-500"
							: "text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-purple-400 group-hover:to-pink-400"
					}`}
				>
					{article.title}
				</h3>

				<p className="text-neutral-400/80 text-sm line-clamp-2 mb-6 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
					"{article.excerpt}"
				</p>

				{/* Footer Section */}
				<div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								actions.toggleLike(article.id);
							}}
							className={`flex items-center gap-2 group/like ${isLiked ? "text-pink-500" : "text-neutral-500 hover:text-white"}`}
						>
							<div className="relative">
								<Heart
									size={20}
									fill={isLiked ? "currentColor" : "none"}
									className="transition-transform active:scale-150"
								/>
								{isLiked && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="absolute -top-1 -right-1 text-pink-400"
									>
										<Sparkles size={10} />
									</motion.div>
								)}
							</div>
							<span className="text-xs font-black italic">
								{(article.likes ?? 0) + (isLiked ? 1 : 0)}
							</span>
						</button>

						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								const url = `${window.location.origin}/blog/${generateSlug(article.title)}`;
								navigator.clipboard.writeText(url);
								toast.success("Link copied!");
							}}
							className="text-neutral-500 hover:text-white transition-all"
						>
							<Share2 size={18} />
						</button>
					</div>

					<div className="flex items-center gap-3 bg-white/3 px-3 py-1.5 rounded-xl border border-white/5">
						<div className="flex items-center gap-1.5 text-neutral-400">
							<Clock size={12} className="text-purple-500" />
							<span className="text-[10px] font-black tracking-widest">
								{article.readTime}M
							</span>
						</div>
						<div className="w-px h-3 bg-white/10" />
						<div className="flex items-center gap-1.5 text-neutral-400">
							<Eye size={12} className="text-pink-500" />
							<span className="text-[10px] font-black tracking-widest">
								{Number(article.views) > 1000
									? `${(Number(article.views) / 1000).toFixed(1)}K`
									: article.views}
							</span>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
