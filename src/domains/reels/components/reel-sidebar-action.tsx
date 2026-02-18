import { useStore } from '@tanstack/react-store';
import { motion } from 'framer-motion';
import {
    Bookmark,
    Eye,
    Heart,
    Maximize2,
    MessageCircle,
    MoreVertical,
    Volume2,
    VolumeX
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
    openComments,
    reelsStore,
    setVideoReaction,
    toggleMute,
    updateReelAction
} from '../reels.store';
import type { VideoReel } from '../reels.types';
import { QuickReactionsOverlay } from './quick-reactions-0verlay';
import { ActionButton } from './reel-action-button';
import { ShareDrawer } from './reel-share-drawer';

/* --- TYPES --- */

interface SidebarActionsProps {
    video: VideoReel;
    onMore: () => void;
    isFocused: boolean;
    onToggleFocus: () => void;
    onLike: () => void;
    onSave: () => void;
}



/* --- UTILS --- */

const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

/* --- COMPONENTS --- */

export const SidebarActions = ({
    video,
    onMore,
    isFocused,
    onToggleFocus,
    onLike,
    onSave
}: SidebarActionsProps) => {
    const reactions = useStore(reelsStore, (s) => s.reactions);
    const isMuted = useStore(reelsStore, (s) => s.isMuted);
    const selectedEmoji = reactions[video.id] || null;

    return (
        /* The Dark Glassy Wrapper */
        <div className={cn(
            "flex flex-col items-center gap-4 sm:gap-5",
            "bg-black/20 backdrop-blur-xl", // Glassy background
            "px-2 py-4 rounded-full border border-white/5", // Rounded shape
            "z-20"
        )}>
            {/* Like Action */}
            <ActionButton
                icon={<Heart className={cn("transition-colors", video.isLiked ? 'fill-rose-500 text-rose-500' : 'text-white')} />}
                label={formatNumber(video.likes)}
                onClick={onLike}
            />

            {/* Comments Action */}
            <ActionButton
                icon={<MessageCircle className="text-white" />}
                label={formatNumber(video.comments)}
                onClick={() => openComments(video.id)}
            />
            <ActionButton
                icon={<Eye className="text-white" />}
                label={formatNumber(video.views)}
            />
            <ActionButton
                icon={isMuted ? <VolumeX className=" text-white" /> : <Volume2 className="text-white" />}
                onClick={() => toggleMute()}
            />

            {/* Share Action */}
            <ShareDrawer
                videoUrl={`${window.location.origin}/reels/${video.id}`}
            />

            {/* Save Action */}
            <ActionButton
                icon={<Bookmark className={cn("transition-colors", video.isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-white')} />}
                label={video.isSaved ? "Saved" : "Save"}
                onClick={onSave}
            />

            {/* Quick Reactions */}
            <QuickReactionsOverlay
                selectedEmoji={selectedEmoji}
                onReact={(emoji) => setVideoReaction(video.id, emoji)}
            />

            {/* Focus Toggle */}
            <ActionButton
                icon={<Maximize2 className={cn("transition-all", isFocused ? 'text-blue-400 scale-110' : 'text-white')} />}
                label={isFocused ? "Focused" : "Focus"}
                onClick={onToggleFocus}
            />

            {/* More Menu */}
            <ActionButton icon={<MoreVertical className="text-white" />} onClick={onMore} />

            {/* Spinning Audio Disk */}
            <div className="mt-2 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="size-8 sm:size-10 rounded-full border-2 sm:border-4 border-white/20 bg-gradient-to-tr from-gray-900 to-gray-600 p-1"
                >
                    <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        <img src={video.user.avatar} className="size-full object-cover opacity-80" alt="" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

