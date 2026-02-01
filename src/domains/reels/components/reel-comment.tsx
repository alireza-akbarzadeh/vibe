import { useQuery } from '@tanstack/react-query';
import { useStore } from '@tanstack/react-store';
import { Heart, Loader2, Send } from 'lucide-react';
import * as React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { closeComments, reelsStore } from '../reels.store';
import type { CommentItem } from '../reels.types';
import { getReelComments } from '../server/reels.functions';

export default function CommentModal({ videoId }: { videoId: number }) {
    const [comment, setComment] = React.useState('');

    const commentModalOpen = useStore(reelsStore, (s) => s.commentModalOpen);
    const videos = useStore(reelsStore, (s) => s.videos);
    const currentVideo = videos.find(v => v.id === videoId);

    const { data: comments, isLoading } = useQuery({
        queryKey: ['reels', 'comments', videoId],
        queryFn: () => getReelComments(),
        enabled: commentModalOpen,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (comment.trim()) {
            setComment('');
        }
    };

    const newLocal = "fixed bottom-0 left-0 right-0 bg-[#0F0F0F] border-t border-white/10 text-white max-h-[85vh] outline-none flex flex-col z-[100]";
    return (
        <Drawer
            open={commentModalOpen}
            onOpenChange={(open) => !open && closeComments()}
            shouldScaleBackground
        >
            <DrawerContent className={newLocal}>
                <div className="mx-auto mt-3 h-1.5 w-12 flex-shrink-0 rounded-full bg-white/30" />

                <DrawerHeader className="border-b border-white/5 px-6 pb-4 mt-2">
                    <DrawerTitle className="text-left font-bold text-base flex items-baseline">
                        Comments
                        <span className="text-white/40 ml-2 font-normal text-sm">
                            {currentVideo ? formatNumber(currentVideo.comments) : 0}
                        </span>
                    </DrawerTitle>
                </DrawerHeader>

                {/* --- Dynamic Comments List --- */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="size-8 text-white/20 animate-spin" />
                            <p className="text-white/40 text-sm">Loading reactions...</p>
                        </div>
                    ) : comments?.length ? (
                        comments.map((c: CommentItem) => (
                            <div key={c.id} className="flex gap-4">
                                <img
                                    src={c.user.avatar}
                                    alt={c.user.username}
                                    className="size-10 rounded-full object-cover flex-shrink-0 border border-white/5"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white/60 font-medium text-xs">
                                            @{c.user.username}
                                        </span>
                                        <span className="text-white/30 text-[10px]">
                                            {c.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-white/90 text-sm leading-relaxed">{c.text}</p>
                                    <div className="flex items-center gap-5 mt-3">
                                        <button className="text-white/40 text-[11px] font-bold uppercase tracking-wider hover:text-white transition-colors">
                                            Reply
                                        </button>
                                        <div className="flex items-center gap-1.5">
                                            <Heart className={`size-3.5 ${c.isLiked ? 'fill-pink-500 text-pink-500' : 'text-white/30'}`} />
                                            <span className="text-[11px] text-white/40 font-medium">{c.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-white/30 text-sm">
                            No comments yet. Start the conversation!
                        </div>
                    )}
                </div>

                {/* --- iPhone Style Persistent Footer --- */}
                <div className="px-6 py-4 border-t border-white/5 bg-[#0F0F0F] pb-10">
                    <form onSubmit={handleSubmit} className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex-shrink-0 border border-white/10" />
                        <div className="flex-1 relative">
                            <Input
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full h-12 rounded-2xl bg-white/5 border-none text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/10"
                            />
                            <button
                                type="submit"
                                disabled={!comment.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 disabled:opacity-0 transition-all"
                            >
                                <Send className="size-5 text-blue-500 fill-blue-500" />
                            </button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

const formatNumber = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};