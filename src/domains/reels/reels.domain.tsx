import { useQuery } from '@tanstack/react-query';
import { useStore } from '@tanstack/react-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import CommentModal from './components/reel-comment';
import { VideoCard } from './components/reels-video-card';
import {
    reelsStore,
    setActiveTab,
    setVideos,
} from './reels.store';
import { getVideoReels } from './server/reels.functions';

export const reelsQueryOptions = {
    queryKey: ['reels', 'feed'],
    queryFn: () => getVideoReels(),
};

export function ReelsDomain() {
    const { data: serverVideos, isLoading } = useQuery(reelsQueryOptions);

    // Subscribe to store
    const { videos, activeTab, activeVideoId, commentModalOpen } = useStore(reelsStore);

    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (serverVideos) setVideos(serverVideos);
    }, [serverVideos]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setCurrentVideoIndex(Number(entry.target.getAttribute('data-index')));
                    }
                });
            },
            { threshold: 0.6 }
        );

        containerRef.current?.querySelectorAll('[data-reel]').forEach((el) => { observer.observe(el); });
        return () => observer.disconnect();
    }, []);

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-black">
            <Loader2 className="size-10 text-white animate-spin" />
        </div>
    );

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden select-none">
            {/* Header */}
            <motion.header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-12 pb-4 bg-gradient-to-b from-black/60 to-transparent">
                <button className="text-white"><Search className="size-6" /></button>
                <div className="flex gap-6">
                    {['following', 'foryou'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'following' | 'foryou')}
                            className="relative px-2 py-1"
                        >
                            <span className={cn(
                                "text-lg font-black uppercase tracking-tighter transition-colors",
                                activeTab === tab ? "text-white" : "text-white/40"
                            )}>
                                {tab === 'foryou' ? 'For You' : 'Following'}
                            </span>
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
                <div className="size-6" />
            </motion.header>

            {/* Scroll Feed */}
            <div ref={containerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black">
                {videos.map((video, index) => (
                    <div key={video.id} data-reel data-index={index} className="h-screen w-full snap-start snap-always">
                        {/* We only pass "isActive" and the data. The card handles the rest via Store */}
                        <VideoCard
                            video={video}
                            isActive={index === currentVideoIndex}
                        />
                    </div>
                ))}
            </div>

            <motion.button className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 size-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                <Plus className="size-8" />
            </motion.button>

            {/* Modal - Controlled by Store */}
            <AnimatePresence>
                {commentModalOpen && activeVideoId && (
                    <CommentModal videoId={activeVideoId} />
                )}
            </AnimatePresence>
        </div>
    );
}

