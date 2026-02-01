import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Download, Flag, Heart, Link as LinkIcon, MessageCircle, MoreVertical, Share2, Smile, UserX, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { QuickReactionsOverlay } from './quick-reactions-0verlay';

type VideoCardProps = {

}

export function VideoCard({ video, isActive, isMuted, onToggleMute, onOpenComments, onLike, onSave, onFollow }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const [showCaption, setShowCaption] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const lastTap = useRef(0);
    const longPressTimer = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (isActive) {
            videoElement.currentTime = 0;
            videoElement.play().then(() => setIsPlaying(true)).catch(() => { });
        } else {
            videoElement.pause();
            videoElement.currentTime = 0;
            setIsPlaying(false);
            setProgress(0);
        }
    }, [isActive]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleTimeUpdate = () => {
            const progress = (videoElement.currentTime / videoElement.duration) * 100;
            setProgress(progress);
        };

        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        return () => videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    }, []);

    const handleVideoClick = (e) => {
        const now = Date.now();
        const timeSinceLastTap = now - lastTap.current;

        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
            // Double tap - like
            handleDoubleTap(e);
        } else {
            // Single tap - play/pause
            togglePlayPause();
        }

        lastTap.current = now;
    };

    const handleDoubleTap = (e) => {
        if (!video.isLiked) {
            onLike(video.id);
        }

        // Show heart animation at tap position
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        onToggleMute();
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const handleShare = async () => {
        const shareData = {
            title: `Check out @${video.user.username}'s video`,
            text: video.caption,
            url: `${window.location.origin}/video/${video.id}`
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                toast.success('Shared successfully!');
            } else {
                // Fallback: Copy link to clipboard
                await navigator.clipboard.writeText(shareData.url);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                // Copy to clipboard as fallback
                try {
                    await navigator.clipboard.writeText(shareData.url);
                    toast.success('Link copied to clipboard!');
                } catch {
                    toast.error('Failed to share');
                }
            }
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/video/${video.id}`);
            toast.success('Link copied!');
            setShowMoreMenu(false);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleReport = () => {
        toast.success('Video reported. We\'ll review it shortly.');
        setShowMoreMenu(false);
    };

    const handleNotInterested = () => {
        toast.success('We\'ll show you less content like this');
        setShowMoreMenu(false);
    };

    const handleDownload = () => {
        toast.success('Download started');
        setShowMoreMenu(false);
    };

    const handleReaction = (emoji) => {
        toast.success(`Reacted with ${emoji}`);
        setShowReactions(false);
    };

    const handleTouchStart = () => {
        longPressTimer.current = setTimeout(() => {
            setShowReactions(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    return (
        <div className="relative h-screen w-full snap-start snap-always">
            {/* Video */}
            <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnail}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                playsInline
                muted={isMuted}
                onClick={handleVideoClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>

            {/* Double tap heart animation */}
            <AnimatePresence>
                {showHeart && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    >
                        <Heart className="w-32 h-32 text-white fill-white" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Reactions Overlay */}
            <QuickReactionsOverlay show={showReactions} onReact={handleReaction} />

            {/* User info and caption */}
            <div className="absolute bottom-20 left-4 right-24 z-20">
                <div className="flex items-center gap-3 mb-3">
                    <button
                        onClick={() => onFollow(video.user.username)}
                        className="relative"
                    >
                        <img
                            src={video.user.avatar}
                            alt={video.user.username}
                            className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        />
                        {!video.user.isFollowing && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center border-2 border-black">
                                <span className="text-white text-xs font-bold">+</span>
                            </div>
                        )}
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-base">
                            @{video.user.username}
                        </span>
                        {video.user.isVerified && (
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Caption */}
                <div className="text-white text-sm mb-3">
                    <p className={`${showCaption ? '' : 'line-clamp-2'}`}>
                        {video.caption}
                    </p>
                    {video.caption.length > 80 && (
                        <button
                            onClick={() => setShowCaption(!showCaption)}
                            className="text-gray-300 font-medium mt-1"
                        >
                            {showCaption ? 'less' : 'more'}
                        </button>
                    )}
                </div>

                {/* Sound info */}
                {video.soundName && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toast.success('Sound added to favorites!');
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md max-w-fit"
                    >
                        <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="text-white text-xs font-medium truncate max-w-[200px]">
                            {video.soundName}
                        </span>
                    </button>
                )}

                {/* Views count */}
                {video.views && (
                    <div className="flex items-center gap-1 mt-2">
                        <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-white/70 text-xs font-medium">
                            {formatNumber(video.views)} views
                        </span>
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="absolute bottom-32 right-4 flex flex-col gap-6 z-20">
                {/* Like */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike(video.id);
                    }}
                    className="flex flex-col items-center gap-1"
                >
                    <motion.div
                        animate={{
                            scale: video.isLiked ? [1, 1.3, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                    >
                        <Heart
                            className={`w-7 h-7 ${video.isLiked ? 'fill-pink-500 text-pink-500' : 'text-white'}`}
                        />
                    </motion.div>
                    <span className="text-white text-xs font-semibold">
                        {formatNumber(video.likes)}
                    </span>
                </motion.button>

                {/* Comment */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenComments(video.id);
                    }}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white text-xs font-semibold">
                        {formatNumber(video.comments)}
                    </span>
                </motion.button>

                {/* Share */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                    }}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <Share2 className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white text-xs font-semibold">
                        {formatNumber(video.shares)}
                    </span>
                </motion.button>

                {/* Save */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSave(video.id);
                    }}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <Bookmark
                            className={`w-7 h-7 ${video.isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`}
                        />
                    </div>
                </motion.button>

                {/* Quick Reactions */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowReactions(!showReactions);
                    }}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <Smile className="w-7 h-7 text-white" />
                    </div>
                </motion.button>

                {/* More */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMoreMenu(!showMoreMenu);
                    }}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <MoreVertical className="w-7 h-7 text-white" />
                    </div>
                </motion.button>
            </div>

            {/* Mute toggle */}
            <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={toggleMute}
                className="absolute top-24 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
            >
                {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                )}
            </motion.button>

            {/* Play/Pause indicator */}
            <AnimatePresence>
                {!isPlaying && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    >
                        <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* More Menu */}
            <AnimatePresence>
                {showMoreMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMoreMenu(false)}
                            className="absolute inset-0 z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 20 }}
                            className="absolute bottom-32 right-20 z-50 w-56 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 px-5 py-4 text-white hover:bg-white/10 transition-colors"
                            >
                                <LinkIcon className="w-5 h-5" />
                                <span className="font-medium">Copy Link</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="w-full flex items-center gap-3 px-5 py-4 text-white hover:bg-white/10 transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                <span className="font-medium">Download</span>
                            </button>
                            <button
                                onClick={handleNotInterested}
                                className="w-full flex items-center gap-3 px-5 py-4 text-white hover:bg-white/10 transition-colors"
                            >
                                <UserX className="w-5 h-5" />
                                <span className="font-medium">Not Interested</span>
                            </button>
                            <div className="h-px bg-white/10" />
                            <button
                                onClick={handleReport}
                                className="w-full flex items-center gap-3 px-5 py-4 text-red-400 hover:bg-white/10 transition-colors"
                            >
                                <Flag className="w-5 h-5" />
                                <span className="font-medium">Report</span>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}