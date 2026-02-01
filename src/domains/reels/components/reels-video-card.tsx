import { useStore } from '@tanstack/react-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Maximize2, Music2, Volume2, VolumeX } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useVideoPlayer } from '../hooks/use-reel-player';
import {
    reelsStore,
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
    const { isMuted } = useStore(reelsStore);
    const { videoRef, progress, togglePlayPause } = useVideoPlayer(isActive);

    const [showHeart, setShowHeart] = React.useState(false);
    const [showMoreMenu, setShowMoreMenu] = React.useState(false);
    const [isPressing, setIsPressing] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false); // NEW: Full size focus state
    const lastTap = React.useRef(0);

    // --- AUTO-ADVANCE & LOOP LOGIC ---
    React.useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl || !isActive) return;

        const handleEnded = () => {
            // If focused, loop the video. If not, go to next.
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

    const handlePointerDown = () => {
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

    const handleVideoClick = (e: React.MouseEvent) => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            if (!video.isLiked) updateReelAction(video.id, 'like');
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 800);
        } else {
            togglePlayPause();
        }
        lastTap.current = now;
    };

    return (
        <div
            className="relative h-full w-full bg-black overflow-hidden"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnail}
                className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out",
                    isPressing ? "scale-[0.98] brightness-75" : "scale-100",
                    isFocused ? "scale-105" : "scale-100" // Slight zoom for focus mode
                )}
                loop={isFocused} // Native loop only when focused
                playsInline
                muted={isMuted}
                onClick={handleVideoClick}
            />

            {/* Exit Focus Button - Only visible when in full size */}
            <AnimatePresence>
                {isFocused && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={(e) => { e.stopPropagation(); setIsFocused(false); }}
                        className="absolute top-14 left-6 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold uppercase"
                    >
                        <Maximize2 className="size-4 rotate-180" />
                        Exit Full Size
                    </motion.button>
                )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* UI Content - Hidden when pressing OR when focused */}
            <div className={cn(
                "transition-all duration-500 ease-in-out",
                (isPressing || isFocused) ? "opacity-0 pointer-events-none translate-y-10" : "opacity-100 translate-y-0"
            )}>
                <div className="absolute bottom-10 left-4 right-24 z-20">
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={() => toggleFollow(video.user.username)} className="relative">
                            <img src={video.user.avatar} className="size-12 rounded-full border-2 border-white object-cover" alt="" />
                            {!video.user.isFollowing && (
                                <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-pink-500 flex items-center justify-center border-2 border-black text-white text-[10px] font-black">+</div>
                            )}
                        </button>
                        <span className="text-white font-black text-sm uppercase tracking-[0.15em] drop-shadow-lg">@{video.user.username}</span>
                    </div>
                    <p className="mb-4 text-white/90 text-sm font-medium line-clamp-2 leading-relaxed drop-shadow-md">{video.caption}</p>
                    <div className="flex items-center gap-2 text-white/80">
                        <Music2 className="size-3 animate-pulse" />
                        <div className="overflow-hidden w-40">
                            <motion.p animate={{ x: [0, -100] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="text-[11px] font-bold uppercase whitespace-nowrap">
                                {video.soundName} • Original Audio
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Actions - Always visible unless pressing (so we can toggle focus) */}
            <div className={cn(
                "transition-opacity duration-300",
                isPressing ? "opacity-0" : "opacity-100"
            )}>
                <SidebarActions
                    video={video}
                    onMore={() => setShowMoreMenu(true)}
                    isFocused={isFocused}
                    onToggleFocus={() => setIsFocused(!isFocused)}
                />
            </div>

            <ReelMoreMenu isOpen={showMoreMenu} onClose={() => setShowMoreMenu(false)} onAction={() => { }} />

            <button onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="absolute top-20 right-4 z-30 size-10 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10">
                {isMuted ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
            </button>

            {/* Progress Bar - Hidden when focused */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 transition-opacity",
                isFocused ? "opacity-0" : "opacity-100"
            )}>
                <motion.div className="h-full bg-white shadow-[0_0_10px_#fff]" animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
            </div>

            <AnimatePresence>
                {showHeart && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} exit={{ scale: 2, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                        <Heart className="size-32 text-white fill-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}