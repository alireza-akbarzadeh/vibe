import { useStore } from "@tanstack/react-store";
import {
	Heart,
	MoreHorizontal,
	Reply,
	Send,
	ShieldCheck,
	Sparkles,
	User,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "@/components/motion";
import type { Comment } from "../blog-mock";
import { commentActions, commentStore } from "../store/comment-store";

interface CommentProps {
	comment: Comment;
	isLatest?: boolean;
}

export function CommentItem({ comment, isLatest }: CommentProps) {
	const isAdmin = comment.isAdmin;

	// Subscribe to store states
	const isInlineReplying = useStore(
		commentStore,
		(state) => state.replyingToId === comment.id,
	);
	const replyValue = useStore(commentStore, (state) => state.replyDraft);
	const isGlobalPosting = useStore(commentStore, (state) => state.isPosting);

	const replyInputRef = useRef<HTMLTextAreaElement>(null);

	// Auto-focus the input when this specific comment is being replied to
	useEffect(() => {
		if (isInlineReplying) {
			replyInputRef.current?.focus();
		}
	}, [isInlineReplying]);

	const handleToggleReply = () => {
		if (isInlineReplying) {
			commentActions.setReplyingTo(null);
		} else {
			commentActions.setReplyingTo(comment.id);
		}
	};

	const handleInlineSubmit = async () => {
		if (!replyValue.trim() || isGlobalPosting) return;
		await commentActions.addComment(replyValue, comment.id);
	};

	return (
		<motion.div
			layout
			id={`comment-${comment.id}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`relative flex gap-4 md:gap-6 ${comment.parentId ? "ml-12 md:ml-24" : ""}`}
		>
			{/* Thread Line */}
			{comment.parentId && (
				<div className="absolute -left-8 md:-left-12 top-0 bottom-0 w-px bg-white/5 hidden md:block">
					<div className="absolute top-10 left-0 w-8 h-px bg-white/5" />
				</div>
			)}

			{/* Avatar Section */}
			<div className="relative shrink-0">
				<motion.img
					src={comment.author.avatar}
					className={`w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] object-cover border-2 transition-all duration-500 ${
						isLatest
							? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
							: isAdmin
								? "border-purple-500/40"
								: "border-white/5"
					}`}
				/>
				{isAdmin && (
					<div className="absolute -bottom-1 -right-1 bg-purple-600 p-1 rounded-lg border-2 border-black">
						<ShieldCheck size={10} className="text-white" />
					</div>
				)}
				{isLatest && (
					<div className="absolute -top-1 -left-1 flex h-4 w-4">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500 border-2 border-black"></span>
					</div>
				)}
			</div>

			<div className="flex-1 flex flex-col gap-3">
				{/* Main Card */}
				<div
					className={`relative rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 transition-all duration-700
                    ${
											isLatest
												? "bg-purple-500/10 border border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.1)]"
												: isAdmin
													? "bg-white/[0.03] border border-purple-500/20"
													: "bg-white/2 border border-white/5 hover:bg-white/4"
										}`}
				>
					{isLatest && (
						<div className="absolute top-0 right-12 -translate-y-1/2 bg-purple-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
							New Message
						</div>
					)}

					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<span
								className={`font-black text-lg italic tracking-tight ${isAdmin || isLatest ? "text-purple-400" : "text-white"}`}
							>
								{comment.author.name}
							</span>
							<div className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded text-[8px] font-black text-neutral-500 uppercase tracking-widest border border-white/5">
								{isAdmin ? <Sparkles size={8} /> : <User size={8} />}
								{comment.author.role}
							</div>
							<span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
								{comment.timestamp}
							</span>
						</div>
						<button
							type="button"
							className="text-neutral-600 hover:text-white transition-colors"
						>
							<MoreHorizontal size={18} />
						</button>
					</div>

					<p
						className={`text-base md:text-lg leading-relaxed mb-6 ${isAdmin || isLatest ? "text-neutral-200" : "text-neutral-400"}`}
					>
						{comment.content}
					</p>

					<div className="flex items-center gap-6 border-t border-white/5 pt-6">
						<button
							type="button"
							className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-pink-500 transition-all"
						>
							<Heart size={14} className="group-hover:fill-current" />{" "}
							{comment.likes}
						</button>
						<button
							type="button"
							onClick={handleToggleReply}
							className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isInlineReplying ? "text-white" : "text-neutral-500 hover:text-purple-400"}`}
						>
							<Reply
								size={14}
								className={
									isInlineReplying ? "rotate-180 transition-transform" : ""
								}
							/>
							{isInlineReplying ? "Cancel" : "Reply"}
						</button>
					</div>
				</div>

				{/* Inline Reply Input (Global Store Powered) */}
				<AnimatePresence>
					{isInlineReplying && (
						<motion.div
							initial={{ opacity: 0, height: 0, y: -10 }}
							animate={{ opacity: 1, height: "auto", y: 0 }}
							exit={{ opacity: 0, height: 0, y: -10 }}
							className="overflow-hidden"
						>
							<div className="flex items-center gap-3 bg-neutral-900/80 border border-purple-500/30 p-2 rounded-2xl ml-4 shadow-xl">
								<textarea
									ref={replyInputRef}
									value={replyValue}
									onChange={(e) => commentActions.setReplyDraft(e.target.value)}
									disabled={isGlobalPosting}
									placeholder={`Reply to ${comment.author.name}...`}
									className="flex-1 bg-transparent text-white text-sm py-2 px-3 focus:outline-none resize-none min-h-[40px] disabled:opacity-50"
									rows={1}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleInlineSubmit();
										}
									}}
								/>
								<button
									type="button"
									onClick={handleInlineSubmit}
									disabled={!replyValue.trim() || isGlobalPosting}
									className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-400 disabled:opacity-30 transition-all min-w-[40px] flex items-center justify-center"
								>
									{isGlobalPosting ? (
										<motion.div
											animate={{ rotate: 360 }}
											transition={{
												repeat: Infinity,
												duration: 1,
												ease: "linear",
											}}
										>
											<Sparkles size={16} />
										</motion.div>
									) : (
										<Send size={16} />
									)}
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
}
