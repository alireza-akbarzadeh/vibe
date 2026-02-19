import { useStore } from "@tanstack/react-store";
import { Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "@/components/motion";
import { commentActions, commentStore } from "../store/comment-store";
import { CommentItem } from "./comment-item";

export function ArticleComments() {
	const [input, setInput] = useState("");
	const { comments, latestId, isPosting } = useStore(commentStore);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isPosting) return;
		await commentActions.addComment(input);
		setInput("");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && e.shiftKey) {
			e.preventDefault();
			handleSubmit(e as React.FormEvent);
		}
	};

	return (
		// biome-ignore lint/correctness/useUniqueElementIds: The ID is used for scrolling to the comments section.
		<div id="comments-section" className="mt-40 max-w-4xl mx-auto px-4 md:px-0">
			<div className="flex items-center gap-4 mb-12">
				<div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
					<Sparkles size={20} className="text-purple-400" />
				</div>
				<h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">
					Discussion
				</h2>
			</div>

			<LayoutGroup>
				<form onSubmit={handleSubmit} className="group relative mb-24">
					<div className="absolute -inset-1 bg-linear-to-r from-purple-600/30 to-blue-600/30 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
					<motion.div
						layout
						className="relative p-6 md:p-8 bg-neutral-900/80 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl"
					>
						<div className="flex gap-6">
							<img
								src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
								className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/5"
								alt="Avatar"
							/>
							<div className="flex-1">
								<textarea
									ref={inputRef}
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Add to the conversation..."
									className="w-full bg-transparent text-white placeholder:text-neutral-700 focus:outline-none resize-none text-lg py-2 min-h-20"
								/>
								<div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/5 pt-6">
									<span className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">
										<span className="text-purple-500">Shift + Enter</span> to
										Post
									</span>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="submit"
										disabled={!input.trim() || isPosting}
										className="flex items-center justify-center gap-3 bg-white text-black px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 transition-all shadow-2xl min-w-[180px]"
									>
										{isPosting ? (
											<motion.div
												animate={{ rotate: 360 }}
												transition={{
													repeat: Infinity,
													duration: 1,
													ease: "linear",
												}}
											>
												<Sparkles size={14} />
											</motion.div>
										) : (
											<>
												Post Comment <Send size={14} />
											</>
										)}
									</motion.button>
								</div>
							</div>
						</div>
					</motion.div>
				</form>

				<div className="space-y-6 relative pb-40">
					<AnimatePresence mode="popLayout" initial={false}>
						{comments.map((c) => (
							<CommentItem
								key={c.id}
								comment={c}
								isLatest={c.id === latestId}
							/>
						))}
					</AnimatePresence>
				</div>
			</LayoutGroup>
		</div>
	);
}
