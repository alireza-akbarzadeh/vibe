import { useStore } from '@tanstack/react-store';
import { AnimatePresence, motion } from 'framer-motion';
import { actions, blogStore, initialReactionCounts } from '@/domains/blog/blog.store';

interface ReactionSectionProps {
    articleId: number;
}

export default function ReactionSection({ articleId }: ReactionSectionProps) {
    const activeReaction = useStore(blogStore, (s) => s.reactions[articleId]);
    const counts = useStore(blogStore, (s) => s.reactionCounts[articleId] || initialReactionCounts);

    const REACTIONS = [
        { emoji: '🤯', label: 'Mind Blown' },
        { emoji: '🔥', label: 'Lit' },
        { emoji: '💖', label: 'Love' },
        { emoji: '👀', label: 'Interesting' },
        { emoji: '⚡️', label: 'Electric' },
    ];

    return (
        <div className="mt-32 p-16 rounded-[4rem] bg-white/2 border border-white/5 text-center">
            <h4 className="text-3xl font-black text-white mb-10 italic">
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
                                whileHover={{ y: -8, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative w-24 h-24 rounded-[2rem] border transition-all duration-500 flex flex-col items-center justify-center gap-1 ${isActive
                                    ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)] text-white'
                                    : 'bg-white/3 border-white/5 text-neutral-500 hover:bg-white/8 hover:border-white/20'
                                    }`}
                            >
                                <span className="text-3xl mb-1">{emoji}</span>

                                {/* COUNTER */}
                                <span className={`text-[11px] font-black transition-colors ${isActive ? 'text-purple-400' : 'text-neutral-600'
                                    }`}>
                                    {counts[emoji]}
                                </span>

                                {/* ACTIVE GLOW RING */}
                                {isActive && (
                                    <motion.div
                                        layoutId="reaction-glow"
                                        className="absolute -inset-1 rounded-[2.2rem] border border-purple-500/20 blur-sm"
                                    />
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}