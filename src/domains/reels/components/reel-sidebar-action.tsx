import { useStore } from '@tanstack/react-store';
import { motion } from 'framer-motion';
import {
    Bookmark,
    Heart,
    Maximize2,
    MessageCircle,
    MoreVertical
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
    openComments,
    reelsStore,
    setVideoReaction,
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
    isFocused, onToggleFocus
}: SidebarActionsProps) => {
    // 1. Hook into reactions from store for this specific video
    const reactions = useStore(reelsStore, (s) => s.reactions);
    const selectedEmoji = reactions[video.id] || null;

    return (
        <div className="absolute bottom-24 right-4 flex flex-col gap-5 z-20">
            {/* Like Action */}

            <ActionButton
                icon={<Heart className={cn("size-7 transition-colors", video.isLiked ? 'fill-rose-500 text-rose-500' : 'text-white')} />}
                label={formatNumber(video.likes)}
                onClick={() => updateReelAction(video.id, 'like')}
            />

            {/* Comments Action - Using Store Action */}
            <ActionButton
                icon={<MessageCircle className="size-7 text-white" />}
                label={formatNumber(video.comments)}
                onClick={() => openComments(video.id)}
            />

            {/* Share Action */}
            <ShareDrawer
                videoUrl={`${window.location.origin}/reels/${video.id}`}
            />

            {/* Save Action */}
            <ActionButton
                icon={<Bookmark className={cn("size-7 transition-colors", video.isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-white')} />}
                label={video.isSaved ? "Saved" : "Save"}
                onClick={() => updateReelAction(video.id, 'save')}
            />

            {/* Quick Reactions - Pulling emoji from Store state */}
            <QuickReactionsOverlay
                selectedEmoji={selectedEmoji}
                onReact={(emoji) => setVideoReaction(video.id, emoji)}
            />
            <ActionButton
                icon={<Maximize2 className={cn("size-6 transition-all", isFocused ? 'text-blue-400 scale-110' : 'text-white')} />}
                label={isFocused ? "Focused" : "Focus"}
                onClick={onToggleFocus}
                className={isFocused ? "bg-blue-500/20" : ""}
            />
            {/* More Menu Trigger */}
            <ActionButton icon={<MoreVertical className="size-7 text-white" />} onClick={onMore} />

            {/* Spinning Audio Disk */}
            <div className="mt-2 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="size-10 rounded-full border-4 border-white/20 bg-linear-to-tr from-gray-900 to-gray-600 p-1"
                >
                    <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        <img src={video.user.avatar} className="size-full object-cover opacity-80" alt={video.user.username} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};


