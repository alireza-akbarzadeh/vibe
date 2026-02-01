import { useQuery } from '@tanstack/react-query';
import { useStore } from '@tanstack/react-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    const { videos, activeTab, activeVideoId, commentModalOpen } = useStore(reelsStore);

    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync server data to global store
    useEffect(() => {
        if (serverVideos) setVideos(serverVideos);
    }, [serverVideos]);

    // Handle smooth scrolling to next video
    const scrollToNext = useCallback(() => {
        if (currentVideoIndex < videos.length - 1) {
            const nextIndex = currentVideoIndex + 1;
            const nextEl = containerRef.current?.querySelector(`[data-index="${nextIndex}"]`);
            nextEl?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentVideoIndex, videos.length]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

        containerRef.current?.querySelectorAll('[data-reel]').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [videos]);

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-black">
            <Loader2 className="size-10 text-white animate-spin" />
        </div>
    );

    return (
        <main vaul-drawer-wrapper="" className="bg-black">
            <div className="relative h-screen w-screen bg-black overflow-hidden select-none">

                {/* Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-12 pb-4 bg-linear-to-b from-black/80 to-transparent"
                >
                    <button className="text-white hover:opacity-70 transition-opacity">
                        <Search className="size-6" />
                    </button>

                    <div className="flex gap-6">
                        {(['following', 'foryou'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="relative px-2 py-1 outline-none"
                            >
                                <span className={cn(
                                    "text-lg font-black uppercase tracking-tighter transition-colors",
                                    activeTab === tab ? "text-white" : "text-white/40"
                                )}>
                                    {tab === 'foryou' ? 'For You' : 'Following'}
                                </span>
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="size-6" />
                </motion.header>

                {/* Scroll Feed Container */}
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
                                onVideoEnd={scrollToNext}
                            />
                        </div>
                    ))}
                </div>

                {/* Create Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 size-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    <Plus className="size-8" />
                </motion.button>

                {/* Modal - Controlled by Store */}
                <AnimatePresence>
                    {commentModalOpen && activeVideoId && (
                        <CommentModal videoId={activeVideoId} />
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}