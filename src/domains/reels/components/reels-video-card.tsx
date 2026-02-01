import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Link2, Music2, Volume2, VolumeX } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { useVideoPlayer } from '../hooks/use-reel-player';
import type { VideoReel } from '../server/reels.functions';
import { ReelMoreMenu } from './reel-more-menu';
import { SidebarActions } from './reel-sidebar-action';

export interface VideoCardProps {
    video: VideoReel;
    isActive: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
    onOpenComments: (id: number) => void;
    onLike: (id: number) => void;
    onSave: (id: number) => void;
    onFollow: (username: string) => void;
}

export function VideoCard({
    video, isActive, isMuted, onToggleMute, onOpenComments, onLike, onSave, onFollow
}: VideoCardProps) {
    const { videoRef, progress, togglePlayPause } = useVideoPlayer(isActive);
    const [showHeart, setShowHeart] = React.useState(false);
    const [showMoreMenu, setShowMoreMenu] = React.useState(false);

    // NEW: State to track which emoji was selected
    const [selectedEmoji, setSelectedEmoji] = React.useState<string | null>(null);

    const lastTap = React.useRef(0);

    const handleVideoClick = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            if (!video.isLiked) onLike(video.id);
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 800);
        } else {
            togglePlayPause();
        }
        lastTap.current = now;
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/reels/${video.id}`);
            toast.success('Link copied to clipboard!', {
                icon: <Link2 className="size-4" />,
                className: "rounded-2xl bg-[#121212] border-white/10 text-white font-bold"
            });
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const handleMenuAction = (type: string) => {
        setShowMoreMenu(false);
        if (type === 'copy') handleShare();
        else toast(`Action: ${type.toUpperCase()}`);
    };

    return (
        <div className="relative h-full w-full bg-black overflow-hidden">
            {/* The Video Engine */}
            <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnail}
                className="absolute inset-0 h-full w-full object-cover"
                loop
                playsInline
                muted={isMuted}
                onClick={handleVideoClick}
            />

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Information Overlay */}
            <div className="absolute bottom-10 left-4 right-24 z-20">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => onFollow(video.user.username)} className="relative">
                        <img src={video.user.avatar} className="size-12 rounded-full border-2 border-white object-cover" alt="" />
                        {!video.user.isFollowing && (
                            <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-pink-500 flex items-center justify-center border-2 border-black text-white text-[10px] font-black">+</div>
                        )}
                    </button>
                    <span className="text-white font-black text-sm uppercase tracking-[0.15em] drop-shadow-lg">
                        @{video.user.username}
                    </span>
                </div>

                <p className="mb-4 text-white/90 text-sm font-medium line-clamp-2 leading-relaxed drop-shadow-md">
                    {video.caption}
                </p>

                {/* Scroller for Sound */}
                <div className="flex items-center gap-2 text-white/80">
                    <Music2 className="size-3 animate-pulse" />
                    <div className="overflow-hidden w-40">
                        <motion.p
                            animate={{ x: [0, -100] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="text-[11px] font-bold uppercase whitespace-nowrap"
                        >
                            {video.soundName} • Original Audio • {video.user.username}
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Interaction Sidebar */}
            <SidebarActions
                video={video}
                selectedEmoji={selectedEmoji} // Pass the emoji state
                onLike={onLike}
                onOpenComments={onOpenComments}
                onSave={onSave}
                onShare={handleShare}
                onMore={() => setShowMoreMenu(true)}
                onReact={(emoji) => {
                    setSelectedEmoji(emoji); // Set emoji to change the icon
                    console.log("Reacted with:", emoji);
                    // The menu will now close automatically because we removed preventDefault in the Overlay component
                }}
            />

            {/* Global More Menu */}
            <ReelMoreMenu
                isOpen={showMoreMenu}
                onClose={() => setShowMoreMenu(false)}
                onAction={handleMenuAction}
            />

            {/* Header Controls */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
                className="absolute top-20 right-4 z-30 size-10 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10"
            >
                {isMuted ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
            </button>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                <motion.div
                    className="h-full bg-white shadow-[0_0_10px_#fff]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>

            {/* Double Tap Heart Feedback */}
            <AnimatePresence>
                {showHeart && (
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
        </div>
    );
}