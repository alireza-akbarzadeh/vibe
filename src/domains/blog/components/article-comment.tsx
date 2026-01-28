import { motion } from 'framer-motion';
import { Send, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ArticleComments() {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([
        {
            id: 1,
            author: { name: "Alex Turner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
            content: "This article perfectly captures the essence of Zimmer's work. The way you describe the sonic layering is spot on!",
            likes: 24,
            timestamp: "2 hours ago"
        },
        {
            id: 2,
            author: { name: "Maya Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
            content: "I've been following this series and each piece gets better. Would love to see more on Göransson's work.",
            likes: 18,
            timestamp: "5 hours ago"
        }
    ]);

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        const newComment = {
            id: comments.length + 1,
            author: { name: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" },
            content: comment,
            likes: 0,
            timestamp: "Just now"
        };
        setComments([newComment, ...comments]);
        setComment('');
    };

    return (
        <div className="mt-20 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Discussion ({comments.length})</h2>

            <form onSubmit={handleComment} className="mb-12">
                <div className="flex gap-4">
                    <img alt={""} src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 resize-none transition-colors"
                            rows={3}
                        />
                        <div className="mt-3 flex justify-end">
                            <Button type="submit" disabled={!comment.trim()} className="bg-white text-black hover:bg-neutral-200">
                                <Send className="w-4 h-4 mr-2" /> Post Comment
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="space-y-6">
                {comments.map((c) => (
                    <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                        <img src={c.author.avatar} alt='' className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold text-white">{c.author.name}</span>
                                <span className="text-xs text-neutral-500">{c.timestamp}</span>
                            </div>
                            <p className="text-neutral-300 text-sm leading-relaxed">{c.content}</p>
                            <div className="flex items-center gap-4 mt-4">
                                <button type='button' className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors">
                                    <ThumbsUp size={14} /> {c.likes}
                                </button>
                                <button type='button' className="text-xs text-neutral-500 hover:text-white transition-colors">Reply</button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}