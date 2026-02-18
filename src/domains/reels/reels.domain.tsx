import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from '@tanstack/react-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { client } from '@/orpc/client';
import CommentModal from './components/reel-comment';
import { VideoCard } from './components/reels-video-card';
import {
    reelsStore,
    setActiveTab,
    setVideos,
} from './reels.store';
import type { VideoReel } from './reels.types';

export const layoutSize = "max-w-xl mx-auto";

export function ReelsDomain() {
    const { videos, activeTab, activeVideoId, commentModalOpen } = useStore(reelsStore);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const { ref: intersectionRef, entry } = useIntersection({
        root: containerRef.current,
        threshold: 0.5,
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useInfiniteQuery({
        queryKey: ['media', 'list', 'reels', activeTab],
        queryFn: async ({ pageParam = 1 }) => {
            const category = activeTab === 'following' ? undefined : 'TRENDING';

            const response = await client.media.list({
                page: pageParam,
                limit: 5,
                category: category,
                hasVideo: true,
            });

            return response;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.data.pagination.page < lastPage.data.pagination.totalPages) {
                return lastPage.data.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Sync server data to global store
    useEffect(() => {
        if (data) {
            const mappedVideos: VideoReel[] = data.pages.flatMap((page) =>
                page.data.items
                    .filter(item => item.videoUrl) // Filter out items without video URL
                    .map((item) => ({
                        id: item.id,
                        videoUrl: item.videoUrl || "",
                        thumbnail: item.thumbnail,
                        user: {
                            username: item.creators[0]?.creator.name || "Unknown",
                            avatar: item.creators[0]?.creator.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.creators[0]?.creator.name || item.id}`,
                            isFollowing: false,
                            isVerified: true,
                        },
                        caption: item.description,
                        likes: Math.floor((item.rating || 0) * 100 + (item.viewCount / 100)),
                        comments: item.reviewCount,
                        shares: 0,
                        views: item.viewCount,
                        isLiked: false,
                        isSaved: false,
                        soundName: item.title,
                        soundId: item.id,
                    }))
            );

            setVideos(mappedVideos);

            // Reset current video index if it's out of bounds
            setCurrentVideoIndex(prev =>
                prev >= mappedVideos.length ? Math.max(0, mappedVideos.length - 1) : prev
            );
        }
    }, [data]);

    // Fetch next page when reaching the end using the intersection hook
    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage && !isLoading) {
            fetchNextPage();
        }
    }, [entry?.isIntersecting, hasNextPage, fetchNextPage, isLoading]);

    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        if (!isNaN(index)) {
                            setCurrentVideoIndex(index);
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );

        const elements = containerRef.current?.querySelectorAll('[data-reel]');
        elements?.forEach((el) => {
            observerRef.current?.observe(el);
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const scrollToNext = useCallback(() => {
        if (currentVideoIndex < videos.length - 1) {
            const nextIndex = currentVideoIndex + 1;
            const nextEl = containerRef.current?.querySelector(`[data-index="${nextIndex}"]`);
            nextEl?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentVideoIndex, videos.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentVideoIndex > 0) {
                    const prevEl = containerRef.current?.querySelector(`[data-index="${currentVideoIndex - 1}"]`);
                    prevEl?.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentVideoIndex < videos.length - 1) {
                    const nextEl = containerRef.current?.querySelector(`[data-index="${currentVideoIndex + 1}"]`);
                    nextEl?.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentVideoIndex, videos.length]);

    // Loading state
    if (isLoading && videos.length === 0) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
                <div className="relative h-full w-full max-w-xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="absolute top-0 w-full z-50 flex items-center justify-between px-6 pt-12 pb-4">
                        <Skeleton className="size-6 rounded-full bg-white/10" />
                        <div className="flex gap-6">
                            <Skeleton className="h-6 w-20 bg-white/10 rounded-full" />
                            <Skeleton className="h-6 w-20 bg-white/10 rounded-full" />
                        </div>
                        <div className="size-6" />
                    </div>

                    {/* Video Skeleton */}
                    <Skeleton className="h-full w-full bg-zinc-900" />

                    {/* Sidebar Actions Skeleton */}
                    <div className="absolute right-2 bottom-20 z-30 flex flex-col gap-4 items-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="size-10 rounded-full bg-white/10" />
                        ))}
                    </div>

                    {/* Bottom Info Skeleton */}
                    <div className="absolute bottom-14 left-4 right-20 z-20">
                        <div className="flex items-center gap-3 mb-4">
                            <Skeleton className="size-11 rounded-full bg-white/10" />
                            <Skeleton className="h-4 w-32 bg-white/10 rounded" />
                        </div>
                        <Skeleton className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                        <Skeleton className="h-4 w-1/2 bg-white/10 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (isError && videos.length === 0) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
                <p className="mb-4">Error loading videos: {error?.message}</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <main vaul-drawer-wrapper="" className={`bg-[#0a0a0a] items-center relative flex justify-center ${layoutSize}`}>
            <div className="relative h-screen w-screen bg-black overflow-hidden select-none">
                {/* Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`fixed top-0 w-full z-50 flex items-center justify-between px-6 pt-12 pb-4 bg-linear-to-b from-black/80 to-transparent ${layoutSize} pointer-events-none`}
                >
                    <div className="flex space-x-4 pointer-events-auto">
                        <button className="text-white hover:opacity-70 transition-opacity">
                            <Search className="size-6" />
                        </button>
                    </div>
                    <div className="flex gap-6 pointer-events-auto">
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
                    {videos.length === 0 && !isLoading && (
                        <div className="h-full flex items-center justify-center text-white/50">
                            No videos found
                        </div>
                    )}

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

                    {/* Loading indicator at bottom with ref for intersection */}
                    {hasNextPage && (
                        <div
                            ref={intersectionRef}
                            className="h-20 flex items-center justify-center w-full snap-start"
                        >
                            <Loader2 className="size-6 text-white/50 animate-spin" />
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {commentModalOpen && activeVideoId && (
                        <CommentModal videoId={activeVideoId} />
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}