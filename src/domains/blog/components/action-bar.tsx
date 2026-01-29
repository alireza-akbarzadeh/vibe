import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FeatureArticle } from "../blog-mock";
import { actions, blogStore } from "../store/blog.store";

interface ActionBarProps {
	article: FeatureArticle;
}

export default function ActionBar({ article }: ActionBarProps) {
	const [copied, setCopied] = useState(false);

	const isLiked = useStore(blogStore, (s) =>
		article ? s.likes.includes(article.id) : false,
	);
	const isSaved = useStore(blogStore, (s) =>
		article ? s.bookmarks.includes(article.id) : false,
	);

	const handleCopyLink = () => {
		navigator.clipboard.writeText(window.location.href);
		setCopied(true);
		toast.success("Link copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex flex-col w-16 items-center gap-3 bg-white/2 border border-white/10 backdrop-blur-2xl p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
			{/* LIKE BUTTON with Heartbeat */}
			<button
				type="button"
				onClick={() => actions.toggleLike(article.id)}
				className="relative p-4 rounded-full group outline-none"
			>
				<AnimatePresence>
					{isLiked && (
						<motion.div
							layoutId="active-pill"
							transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
							className="absolute inset-0 bg-pink-500/10 border border-pink-500/20 rounded-full"
						/>
					)}
				</AnimatePresence>

				<motion.div
					animate={
						isLiked
							? {
									scale: [1, 1.2, 1.1, 1.3, 1],
								}
							: { scale: 1 }
					}
					transition={
						isLiked
							? {
									duration: 0.8, // Slower, more organic speed
									ease: "easeInOut",
									times: [0, 0.2, 0.4, 0.6, 1], // The "thump-thump" timing
								}
							: { duration: 0.3 }
					}
					className={`relative z-10 ${isLiked ? "text-pink-500" : "text-neutral-500 group-hover:text-white"}`}
				>
					<Heart
						size={20}
						fill={isLiked ? "currentColor" : "none"}
						strokeWidth={isLiked ? 2.5 : 2}
						className="transition-colors duration-500"
					/>
				</motion.div>

				{/* Ambient Pulse Ring */}
				<AnimatePresence>
					{isLiked && (
						<motion.div
							initial={{ scale: 0.8, opacity: 0.5 }}
							animate={{ scale: 2, opacity: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 1, ease: "easeOut" }}
							className="absolute inset-0 bg-pink-500/30 rounded-full z-0"
						/>
					)}
				</AnimatePresence>
			</button>

			<div className="w-8 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

			{/* SAVE BUTTON */}
			<button
				type="button"
				onClick={() => actions.toggleBookmark(article.id)}
				className="relative p-4 rounded-full group outline-none"
			>
				<AnimatePresence>
					{isSaved && (
						<motion.div
							layoutId="active-pill"
							transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
							className="absolute inset-0 bg-purple-500/10 border border-purple-500/20 rounded-full"
						/>
					)}
				</AnimatePresence>
				<motion.div
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					className={`relative z-10 transition-colors duration-500 ${isSaved ? "text-purple-400" : "text-neutral-500 group-hover:text-white"}`}
				>
					<Bookmark
						size={20}
						fill={isSaved ? "currentColor" : "none"}
						strokeWidth={isSaved ? 2.5 : 2}
					/>
				</motion.div>
			</button>

			<div className="w-8 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

			{/* SHARE BUTTON */}
			<button
				type="button"
				onClick={handleCopyLink}
				className="relative p-4 rounded-full group outline-none"
			>
				<motion.div
					whileHover={{ rotate: 15, scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					className={`relative z-10 transition-colors duration-300 ${copied ? "text-green-400" : "text-neutral-500 group-hover:text-white"}`}
				>
					{copied ? <Check size={20} /> : <Share2 size={20} />}
				</motion.div>
			</button>
		</div>
	);
}
