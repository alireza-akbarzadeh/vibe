import { motion } from 'framer-motion';
import {
    Bookmark,
    Heart,
    MessageCircle, MoreVertical,
    Share2
} from 'lucide-react';
import * as React from 'react';
// Shadcn UI Imports
import { cn } from '@/lib/utils';
import type { VideoReel } from '../server/reels.functions';
import { QuickReactionsOverlay } from './quick-reactions-0verlay';

/* --- TYPES --- */


interface ActionButtonProps {
    icon: React.ReactNode;
    label?: string;
    onClick?: () => void; // Optional because the Reaction button uses Trigger
    className?: string;
}

/* --- UTILS --- */

const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

/* --- COMPONENTS --- */

interface SidebarActionsProps {
    video: VideoReel;
    selectedEmoji: string | null; // New prop
    onLike: (id: number) => void;
    onOpenComments: (id: number) => void;
    onSave: (id: number) => void;
    onShare: () => void;
    onMore: () => void;
    onReact: (emoji: string) => void;
}

export const SidebarActions = ({
    video,
    selectedEmoji,
    onLike,
    onOpenComments,
    onSave,
    onShare,
    onMore,
    onReact,
}: SidebarActionsProps) => (
    <div className="absolute bottom-24 right-4 flex flex-col gap-5 z-20">
        <ActionButton
            icon={<Heart className={cn("size-7 transition-colors", video.isLiked ? 'fill-rose-500 text-rose-500' : 'text-white')} />}
            label={formatNumber(video.likes)}
            onClick={() => onLike(video.id)}
        />
        <ActionButton
            icon={<MessageCircle className="size-7 text-white" />}
            label={formatNumber(video.comments)}
            onClick={() => onOpenComments(video.id)}
        />
        <ActionButton
            icon={<Share2 className="size-7 text-white" />}
            label="Share"
            onClick={onShare}
        />
        <ActionButton
            icon={<Bookmark className={cn("size-7 transition-colors", video.isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-white')} />}
            label={video.isSaved ? "Saved" : "Save"}
            onClick={() => onSave(video.id)}
        />

        {/* Pass the state through to the overlay */}
        <QuickReactionsOverlay
            selectedEmoji={selectedEmoji}
            onReact={onReact}
        />

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


const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => (
    <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => {
            if (onClick) {
                e.stopPropagation();
                onClick();
            }
        }}
        className="flex flex-col items-center gap-1"
    >
        <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl transition-colors active:bg-white/20">
            {icon}
        </div>
        {label && <span className="text-[10px] font-black uppercase tracking-tighter text-white drop-shadow-md">{label}</span>}
    </motion.button>
);