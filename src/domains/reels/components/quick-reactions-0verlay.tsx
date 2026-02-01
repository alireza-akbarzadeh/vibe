import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

const reactions = ['❤️', '🔥', '😂', '😮', '😍', '👏'];

export function QuickReactionsOverlay({ onReact, show }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                    <div className="flex gap-3 p-4 rounded-full bg-black/80 backdrop-blur-xl border border-white/10">
                        {reactions.map((emoji, index) => (
                            <motion.button
                                key={emoji}
                                initial={{ scale: 0, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReact(emoji);
                                }}
                                className="text-3xl hover:scale-125 transition-transform pointer-events-auto"
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}