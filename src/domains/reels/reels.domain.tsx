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
    toggleFollow,
    toggleMute,
    updateReelAction
} from './reels.store';
import { getVideoReels } from './server/reels.functions';

// Query Configuration
export const reelsQueryOptions = {
    queryKey: ['reels', 'feed'],
    queryFn: () => getVideoReels(),
};

export function ReelsDomain() {
    // 1. TanStack Query for data fetching
    const { data: serverVideos, isLoading, isError } = useQuery(reelsQueryOptions);

    // 2. TanStack Store for local UI state
    const { videos, isMuted, activeTab } = useStore(reelsStore);

    // 3. Local UI state
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync Query data to Store
    useEffect(() => {
        if (serverVideos) setVideos(serverVideos);
    }, [serverVideos]);

    // Intersection Observer for active video tracking
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setCurrentVideoIndex(index);
                    }
                });
            },
            { threshold: 0.6 }
        );

        const videoElements = containerRef.current?.querySelectorAll('[data-reel]');
        videoElements?.forEach((el) => { observer.observe(el); });

        return () => observer.disconnect();
    }, [videos]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black">
                <Loader2 className="size-10 text-white animate-spin" />
            </div>
        );
    }

    if (isError) return <div className="h-screen flex items-center justify-center text-white">Critical failure: Unable to fetch manifest.</div>;

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden select-none">
            {/* Header Overlay */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-12 pb-4 bg-gradient-to-b from-black/60 to-transparent"
            >
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
                <div className="size-6" /> {/* Spacer */}
            </motion.header>

            {/* Video Scroll Feed */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black"
            >
                {videos.map((video, index) => (
                    <div
                        key={video.id}
                        data-reel
                        data-index={index}
                        className="h-screen w-full snap-start snap-always"
                    >
                        <VideoCard
                            video={video}
                            isActive={index === currentVideoIndex}
                            isMuted={isMuted}
                            onToggleMute={toggleMute}
                            onOpenComments={(id) => setActiveVideoId(id)}
                            onLike={(id) => updateReelAction(id, 'like')}
                            onSave={(id) => updateReelAction(id, 'save')}
                            onFollow={toggleFollow}
                        />
                    </div>
                ))}
            </div>

            {/* Float Actions */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 size-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                <Plus className="size-8" />
            </motion.button>

            {/* Comment Modal */}
            <AnimatePresence>
                {activeVideoId && (
                    <CommentModal
                        isOpen={true}
                        onClose={() => setActiveVideoId(null)}
                        videoId={activeVideoId}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}