import { useStore } from "@tanstack/react-store";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { openAddToPlaylist, type Song } from "@/domains/music/music.store";
import { playerStore, setVolume, toggleLike, toggleMute, toggleShuffle } from "@/domains/music/player.store";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DesktopPlayer } from "./desktop-bottom-player";
import { MobilePlayer } from "./mobile-bottom-player";


export interface PlayerBaseProps {
    currentSong: Song;
    isPlaying: boolean;
    onPlayPause: () => void;
    currentTime: number;
    onTimeChange: (time: number) => void;
    onNext: () => void;
    onPrevious: () => void;
    onToggleLyrics: () => void;
    onToggleQueue: () => void;
    onToggleDevices: () => void;
    onToggleFullscreen: () => void;
}

export interface PlayerComponentProps extends PlayerBaseProps {
    isLiked: boolean;
    isShuffle: boolean;
    volume: number;
    isMuted: boolean;
    duration: number;
    progressPercentage: number;
    activeVolume: number;
    toggleLike: () => void;
    toggleMute: () => void;
    toggleShuffle: () => void;
    setVolume: (volume: number) => void;
    openAdd: () => void;
}

export function BottomPlayer(props: PlayerBaseProps) {
    const { isMobile } = useMediaQuery();
    const { volume, isMuted, isShuffle, likedSongIds } = useStore(playerStore);
    const isLiked = likedSongIds.has(props.currentSong?.id);
    const duration = props.currentSong.duration;

    // Shared Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (props.isPlaying && props.currentTime < duration) {
            interval = setInterval(() => {
                props.onTimeChange(props.currentTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [props.isPlaying, props.currentTime, duration, props.onTimeChange]);

    const sharedProps = {
        ...props,
        isLiked,
        isShuffle,
        volume,
        isMuted,
        duration,
        progressPercentage: (props.currentTime / duration) * 100,
        activeVolume: isMuted ? 0 : volume,
        toggleLike: () => toggleLike(props.currentSong.id),
        toggleMute,
        toggleShuffle,
        setVolume,
        openAdd: () => openAddToPlaylist(props.currentSong),
    };

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-100 bg-black/90 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)]"
        >
            {isMobile ? <MobilePlayer {...sharedProps} /> : <DesktopPlayer {...sharedProps} />}
        </motion.div>
    );
}