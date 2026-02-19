import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "@/components/motion";
import { actions, blogStore } from "@/domains/blog/store/blog.store";

// A small internal component for the pulsing number
function AnimatedCount({
	count,
	isActive,
}: {
	count: number;
	isActive: boolean;
}) {
	return (
		<div className="relative h-4 overflow-hidden">
			<AnimatePresence mode="wait">
				<motion.span
					key={count}
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
					className={`block text-[11px] font-black ${
						isActive ? "text-purple-400" : "text-neutral-600"
					}`}
				>
					{count}
				</motion.span>
			</AnimatePresence>
		</div>
	);
}

export default function ReactionSection({ articleId }: { articleId: number }) {
	const activeReaction = useStore(blogStore, (s) => s.reactions[articleId]);
	const counts = useStore(
		blogStore,
		(s) =>
			s.reactionCounts[articleId] || {
				"🤯": 12,
				"🔥": 24,
				"💖": 18,
				"👀": 7,
				"⚡️": 15,
			},
	);

	const REACTIONS = [
		{ emoji: "🤯", label: "Mind Blown" },
		{ emoji: "🔥", label: "Lit" },
		{ emoji: "💖", label: "Love" },
		{ emoji: "👀", label: "Interesting" },
		{ emoji: "⚡️", label: "Electric" },
	];

	return (
		<div className="mt-32 p-16 rounded-[4rem] bg-white/[0.02] border border-white/5 text-center">
			<h4 className="text-3xl font-black text-white mb-10 italic tracking-tighter">
				How's your vibe after reading?
			</h4>
			<div className="flex flex-wrap justify-center gap-8">
				{REACTIONS.map(({ emoji, label }) => {
					const isActive = activeReaction === emoji;

					return (
						<div key={emoji} className="flex flex-col items-center gap-4">
							<motion.button
								type="button"
								onClick={() => actions.setReaction(articleId, emoji)}
								// PULSE EFFECT:
								whileHover={{ y: -8 }}
								whileTap={{ scale: 0.92 }}
								animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
								transition={isActive ? { duration: 0.4 } : {}}
								className={`relative w-24 h-24 rounded-[2rem] border transition-all duration-500 flex flex-col items-center justify-center gap-1 ${
									isActive
										? "bg-purple-500/15 border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.1)]"
										: "bg-white/[0.03] border-white/5 text-neutral-500 hover:bg-white/[0.08]"
								}`}
							>
								<span
									className={`text-3xl transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}
								>
									{emoji}
								</span>

								<AnimatedCount count={counts[emoji]} isActive={isActive} />

								{/* THE OUTER GLOW RING */}
								{isActive && (
									<motion.div
										layoutId="reaction-ring"
										className="absolute -inset-1.5 rounded-[2.3rem] border border-purple-500/20 blur-[2px]"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
									/>
								)}
							</motion.button>

							{/* LABEL */}
							<div className="h-4">
								<AnimatePresence>
									{isActive && (
										<motion.span
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 block"
										>
											{label}
										</motion.span>
									)}
								</AnimatePresence>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
