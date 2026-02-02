/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */

import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Bookmark, HomeIcon, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { layoutSize } from '../reels.domain';
import {
    setMoreMenuVideo,
    toggleFocusVideo,
    updateReelAction
} from '../reels.store';
import type { VideoReel } from '../reels.types';
import { ActionButton } from './reel-action-button';
import { ReelMoreMenu } from './reel-more-menu';
import { ShareDrawer } from './reel-share-drawer';

interface VideoCardProps {
    isFocused: boolean
    handleSeek: (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => void
    progress: number
    video: VideoReel
}

export function VideoBottomMenu({ isFocused, handleSeek, progress, video }: VideoCardProps) {
    const navigate = useNavigate()
    return (
        <div className={cn(
            "no-pause fixed bottom-0 rounded-t-2xl left-0  right-0 h-18 bg-linear-to-t from-black/90 via-black/60 to-transparent  transition-opacity duration-300",
            layoutSize,
            isFocused ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
            <div
                className="w-full h-1 bg-white/20 cursor-pointer group"
                onClick={(e) => {
                    e.stopPropagation();
                    handleSeek(e);
                }}
            >
                <motion.div
                    className="h-full bg-linear-to-r rounded-t-2xl from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(192,38,211,0.6)]"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg" />
                </motion.div>
            </div>

            <div className="flex items-center justify-between px-4 h-17">
                <ActionButton
                    icon={<Bookmark className={cn("transition-colors", video.isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-white')} />}
                    onClick={() => updateReelAction(video.id, 'save')}
                />
                <Button
                    onClick={(e) => { e.stopPropagation(); toggleFocusVideo(null); }}
                    className="no-pause   flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold uppercase"
                >
                    <HomeIcon className="size-7" />
                </Button>
                <ActionButton
                    icon={<HomeIcon className={cn("transition-colors", video.isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-white')} />}
                    onClick={() => navigate({ to: "/" })}
                />

                <ReelMoreMenu onAction={() => { }} />
                <ShareDrawer
                    videoUrl={`${window.location.origin}/reels/${video.id}`}
                />
            </div>
        </div >

    );
}