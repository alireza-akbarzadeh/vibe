import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Send, X } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function CommentModal({ isOpen, onClose, videoId }) {
    const [comment, setComment] = useState('');

    const comments = [
        {
            id: 1,
            user: {
                username: 'johndoe',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'
            },
            text: 'This is amazing! 🔥',
            likes: 234,
            isLiked: false,
            timestamp: '2h ago'
        },
        {
            id: 2,
            user: {
                username: 'janesmit',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
            },
            text: 'Where is this place? I need to visit!',
            likes: 89,
            isLiked: true,
            timestamp: '5h ago'
        },
        {
            id: 3,
            user: {
                username: 'creativemind',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
            },
            text: 'Love the editing style! What app did you use?',
            likes: 156,
            isLiked: false,
            timestamp: '1d ago'
        },
        {
            id: 4,
            user: {
                username: 'explorer_x',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
            },
            text: 'Can\'t stop watching this 😍',
            likes: 445,
            isLiked: true,
            timestamp: '1d ago'
        },
        {
            id: 5,
            user: {
                username: 'photogeek',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
            },
            text: 'The cinematography is insane! Tutorial please?',
            likes: 567,
            isLiked: false,
            timestamp: '2d ago'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            // Handle comment submission
            console.log('Comment:', comment);
            setComment('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-3xl max-h-[80vh] flex flex-col"
                    >
                        {/* Handle bar */}
                        <div className="flex items-center justify-center py-3 border-b border-white/10">
                            <div className="w-12 h-1 rounded-full bg-white/20" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <h2 className="text-white font-semibold text-lg">
                                {comments.length} Comments
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Comments list */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <img
                                        src={comment.user.avatar}
                                        alt={comment.user.username}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white font-semibold text-sm">
                                                {comment.user.username}
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                {comment.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-gray-200 text-sm mb-2">
                                            {comment.text}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <button className="text-gray-400 text-xs hover:text-white transition-colors">
                                                Reply
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <Heart
                                                    className={`w-3.5 h-3.5 ${comment.isLiked
                                                            ? 'fill-pink-500 text-pink-500'
                                                            : 'text-gray-400'
                                                        }`}
                                                />
                                                <span className={`text-xs ${comment.isLiked ? 'text-pink-500' : 'text-gray-400'
                                                    }`}>
                                                    {comment.likes}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Comment input */}
                        <form
                            onSubmit={handleSubmit}
                            className="px-6 py-4 border-t border-white/10 bg-slate-900"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                                    alt="Your avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1 relative">
                                    <Input
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full h-12 rounded-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 pr-12"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!comment.trim()}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 disabled:opacity-40"
                                    >
                                        <Send className={`w-5 h-5 ${comment.trim() ? 'text-pink-500' : 'text-gray-400'
                                            }`} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}