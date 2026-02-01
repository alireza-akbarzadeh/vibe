import { useStore } from '@tanstack/react-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Maximize2, Music2, Volume2, VolumeX } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useVideoPlayer } from '../hooks/use-reel-player';
import {
    reelsStore,
    setIsPressing,
    setMoreMenuVideo,
    toggleFocusVideo,
    toggleFollow,
    toggleMute,
    updateReelAction
} from '../reels.store';
import type { VideoReel } from '../reels.types';
import { ReelMoreMenu } from './reel-more-menu';
import { SidebarActions } from './reel-sidebar-action';

interface VideoCardProps {
    video: VideoReel;
    isActive: boolean;
    onVideoEnd: () => void;
}

export function VideoCard({ video, isActive, onVideoEnd }: VideoCardProps) {
    // --- STORE SUBSCRIPTIONS ---
    const {
        isMuted,
        isPressing,
        focusedVideoId,
        showHeartId,
        moreMenuVideoId
    } = useStore(reelsStore);

    const isFocused = focusedVideoId === video.id;
    const isShowingHeart = showHeartId === video.id;
    const isMenuOpen = moreMenuVideoId === video.id;

    const { videoRef, progress, togglePlayPause } = useVideoPlayer(isActive);
    const lastTap = React.useRef(0);

    // --- AUTO-ADVANCE & LOOP LOGIC ---
    React.useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl || !isActive) return;

        const handleEnded = () => {
            if (isFocused) {
                videoEl.currentTime = 0;
                videoEl.play().catch(() => { });
            } else if (!isPressing) {
                onVideoEnd();
            }
        };

        videoEl.addEventListener('ended', handleEnded);
        return () => videoEl.removeEventListener('ended', handleEnded);
    }, [isActive, isPressing, isFocused, onVideoEnd, videoRef]);

    // --- INTERACTION HANDLERS ---
    const handlePointerDown = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest('.no-pause')) return;

        setIsPressing(true);
        if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
        }
    };

    const handlePointerUp = () => {
        setIsPressing(false);
        if (videoRef.current && isActive) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleVideoClick = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            updateReelAction(video.id, 'like');
        } else {
            togglePlayPause();
        }
        lastTap.current = now;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const offsetX = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
        videoRef.current.currentTime = percentage * videoRef.current.duration;
    };

    return (
        <div
            className="relative h-full w-full bg-black overflow-hidden group"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {/* 1. Video Layer */}
            <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnail}
                className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out",
                    isPressing ? "scale-[0.98] brightness-75" : "scale-100",
                    isFocused ? "scale-105" : "scale-100"
                )}
                loop={isFocused}
                playsInline
                muted={isMuted}
                onClick={handleVideoClick}
            />

            {/* 2. Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />

            {/* 3. Exit Focus Button */}
            <AnimatePresence>
                {isFocused && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={(e) => { e.stopPropagation(); toggleFocusVideo(null); }}
                        className="no-pause absolute top-14 left-6 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold uppercase"
                    >
                        <Maximize2 className="size-4 rotate-180" />
                        Exit Full Size
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 4. Bottom Information & Avatar */}
            <div className={cn(
                "absolute bottom-14 left-4 right-20 z-20 transition-all duration-500 ease-in-out",
                (isPressing || isFocused) ? "opacity-0 translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"
            )}>
                {/* User Row */}
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleFollow(video.user.username); }}
                        className="relative no-pause"
                    >
                        <img
                            src={video.user.avatar}
                            className="size-11 rounded-full border-2 border-white object-cover shadow-xl"
                            alt=""
                        />
                        {!video.user.isFollowing && (
                            <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-pink-500 flex items-center justify-center border-2 border-black text-white text-[10px] font-black">
                                +
                            </div>
                        )}
                    </button>
                    <span className="text-white font-bold text-sm tracking-wide drop-shadow-lg">
                        @{video.user.username}
                    </span>
                </div>

                {/* Caption */}
                <p className="mb-4 text-white/95 text-sm font-medium line-clamp-2 leading-snug drop-shadow-md max-w-[90%]">
                    {video.caption}
                </p>

                {/* Music Info */}
                <div className="flex items-center gap-2 text-white/80">
                    <Music2 className="size-3.5 animate-pulse" />
                    <div className="overflow-hidden w-48">
                        <motion.p
                            animate={{ x: [0, -150] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="text-[11px] font-bold uppercase whitespace-nowrap tracking-wider"
                        >
                            {video.soundName} • Original Audio
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* 5. Sidebar Actions */}
            <div className={cn(
                "no-pause absolute right-2 bottom-20 z-30 transition-opacity duration-300",
                isPressing ? "opacity-0" : "opacity-100"
            )}>
                <SidebarActions
                    video={video}
                    onMore={() => setMoreMenuVideo(video.id)}
                    isFocused={isFocused}
                    onToggleFocus={() => toggleFocusVideo(video.id)}
                />
            </div>

            {/* 6. Mute Button */}
            <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="no-pause absolute top-20 right-4 z-40 size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10"
            >
                {isMuted ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
            </button>

            {/* 7. Progress Bar Seeker */}
            <div
                className={cn(
                    "no-pause absolute bottom-0 left-0 right-0 h-8 flex items-end cursor-pointer z-50 transition-opacity",
                    isFocused ? "opacity-0" : "opacity-100"
                )}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        // Seek to middle of the bar on keyboard activation
                        if (!videoRef.current) return;
                        const percentage = 0.5;
                        videoRef.current.currentTime = percentage * (videoRef.current.duration || 0);
                    }
                }}
                onClick={(e) => { e.stopPropagation(); handleSeek(e); }}
            >
                <div className="w-full h-1 bg-white/20 group-hover:h-2 transition-all relative">
                    <motion.div
                        className="h-full bg-linear-to-r from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(192,38,211,0.6)] relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg" />
                    </motion.div>
                </div>
            </div>

            {/* 8. Heart Animation */}
            <AnimatePresence>
                {isShowingHeart && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                    >
                        <Heart className="size-32 text-white fill-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 9. Menus */}
            <ReelMoreMenu
                isOpen={isMenuOpen}
                onClose={() => setMoreMenuVideo(null)}
                onAction={() => { }}
            />
        </div>
    );
}