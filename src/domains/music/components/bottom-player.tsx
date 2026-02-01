import { useStore } from "@tanstack/react-store";
import { motion } from "framer-motion";
import {
    Heart,
    ListMusic,
    Maximize2,
    Mic2,
    MonitorSpeaker,
    Pause,
    PictureInPicture2,
    Play,
    PlusCircle,
    Repeat,
    Shuffle,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { openAddToPlaylist, type Song } from "@/domains/music/music.store";
import {
    playerStore,
    setVolume,
    toggleLike,
    toggleMute,
    toggleShuffle,
} from "@/domains/music/player.store";
import { cn } from "@/lib/utils";

interface BottomPlayerProps {
    currentSong: Song;
    isPlaying: boolean;
    onPlayPause: () => void;
    currentTime: number;
    onTimeChange: (time: number) => void;
}

export function BottomPlayer({
    currentSong,
    isPlaying,
    onPlayPause,
    currentTime,
    onTimeChange,
}: BottomPlayerProps) {
    const { volume, isMuted, isShuffle, likedSongIds } = useStore(playerStore);
    const isLiked = likedSongIds.has(currentSong?.id);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeBarRef = useRef<HTMLDivElement>(null);
    const duration = currentSong.duration;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentTime < duration) {
            interval = setInterval(() => {
                onTimeChange(currentTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentTime, duration, onTimeChange]);

    const handleProgressSeek = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!progressBarRef.current) return;
            const rect = progressBarRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            onTimeChange(Math.floor(percentage * duration));
        },
        [duration, onTimeChange],
    );

    const handleVolumeSeek = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!volumeBarRef.current) return;
            const rect = volumeBarRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.round(
                Math.max(0, Math.min(1, x / rect.width)) * 100,
            );
            setVolume(percentage);
        },
        [],
    );

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progressPercentage = (currentTime / duration) * 100;
    const activeVolume = isMuted ? 0 : volume;

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed bottom-0 left-0 right-0 z-[100] select-none",
                "h-20 md:h-24 px-2 md:px-4 bg-black/90 backdrop-blur-xl border-t border-white/5",
                "pb-[env(safe-area-inset-bottom)]" // Support for mobile home bars
            )}
        >
            {/* Top Micro-Progress Bar (Mobile Only) */}
            <div className="md:hidden absolute top-0 left-0 right-0 h-[2px] bg-white/10">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            <div className="h-full flex items-center justify-between gap-2 md:gap-4">

                {/* 1. LEFT: Song Info */}
                <div className="flex items-center gap-3 md:gap-4 w-auto md:w-[30%] min-w-0">
                    <div className="relative shrink-0 group">
                        <img
                            src={currentSong.albumArt}
                            alt={currentSong.title}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded shadow-2xl object-cover"
                        />
                        <button className="hidden md:block absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-0.5">
                            <PictureInPicture2 className="w-3 h-3 text-white" />
                        </button>
                    </div>
                    <div className="min-w-0 flex-1 md:flex-none">
                        <div className="text-white text-sm md:text-[14px] font-bold truncate">
                            {currentSong.title}
                        </div>
                        <div className="text-[#b3b3b3] text-xs md:text-[11px] truncate">
                            {currentSong.artist}
                        </div>
                    </div>
                    {/* Like & Add Hidden on very small screens, visible on md */}
                    <div className="hidden sm:flex items-center gap-3 ml-2">
                        <button onClick={() => toggleLike(currentSong.id)} className={cn("transition-colors", isLiked ? "text-pink-500" : "text-[#b3b3b3] hover:text-white")}>
                            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                        </button>
                        <button onClick={() => openAddToPlaylist(currentSong)} className="text-[#b3b3b3] hover:text-white transition-colors">
                            <PlusCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 2. CENTER: Main Controls */}
                <div className="flex-1 max-w-[45%] flex flex-col items-center">
                    <div className="flex items-center gap-4 md:gap-6 mb-1 md:mb-2">
                        {/* Hidden on Mobile */}
                        <button onClick={toggleShuffle} className={cn("hidden md:block", isShuffle ? "text-purple-500" : "text-[#b3b3b3] hover:text-white")}>
                            <Shuffle className="w-4 h-4" />
                        </button>
                        <button className="hidden md:block text-[#b3b3b3] hover:text-white">
                            <SkipBack className="w-5 h-5 fill-current" />
                        </button>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onPlayPause}
                            className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 text-black fill-current" />
                            ) : (
                                <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                            )}
                        </motion.button>

                        <button className="text-[#b3b3b3] hover:text-white">
                            <SkipForward className="w-5 h-5 fill-current" />
                        </button>
                        <button className="hidden md:block text-[#b3b3b3] hover:text-white">
                            <Repeat className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Progress Bar (Hidden on Mobile - replaced by top micro-bar) */}
                    <div className="hidden md:flex items-center gap-2 w-full">
                        <span className="text-[11px] text-[#a7a7a7] tabular-nums w-10 text-right">
                            {formatTime(currentTime)}
                        </span>
                        <div
                            ref={progressBarRef}
                            onClick={handleProgressSeek}
                            onKeyDown={(e) => {
                                if (!progressBarRef.current) return;
                                const step = 5; // seconds per arrow press
                                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                                    e.preventDefault();
                                    const next = Math.max(
                                        0,
                                        Math.min(duration, currentTime + (e.key === "ArrowRight" ? step : -step)),
                                    );
                                    onTimeChange(Math.floor(next));
                                } else if (e.key === "Home") {
                                    e.preventDefault();
                                    onTimeChange(0);
                                } else if (e.key === "End") {
                                    e.preventDefault();
                                    onTimeChange(duration);
                                }
                            }}
                            role="slider"
                            tabIndex={0}
                            aria-orientation="horizontal"
                            aria-valuemin={0}
                            aria-valuemax={duration}
                            aria-valuenow={currentTime}
                            aria-valuetext={formatTime(currentTime)}
                            className="flex-1 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer relative"
                        >
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-xl transition-opacity"
                                style={{ left: `calc(${progressPercentage}% - 6px)` }}
                            />
                        </div>
                        <span className="text-[11px] text-[#a7a7a7] tabular-nums w-10">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* 3. RIGHT: Volume & Extras */}
                <div className="flex items-center gap-3 w-auto md:w-[30%] justify-end">
                    {/* On Mobile, only show heart or add icon here */}
                    <button
                        onClick={() => toggleLike(currentSong.id)}
                        className={cn("md:hidden transition-colors", isLiked ? "text-pink-500" : "text-[#b3b3b3]")}
                    >
                        <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
                    </button>

                    {/* Desktop Extra Icons */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Mic2 className="w-4 h-4 text-[#b3b3b3]" />
                        <ListMusic className="w-4 h-4 text-[#b3b3b3]" />
                        <MonitorSpeaker className="w-4 h-4 text-[#b3b3b3]" />
                    </div>

                    {/* Volume Bar (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-2 group w-24 lg:w-32">
                        <button onClick={toggleMute} className="text-[#b3b3b3] hover:text-white">
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <div
                            ref={volumeBarRef}
                            onClick={handleVolumeSeek}
                            onKeyDown={(e) => {
                                if (!volumeBarRef.current) return;
                                const step = 5;
                                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                                    const current = isMuted ? 0 : volume;
                                    const next = Math.max(
                                        0,
                                        Math.min(100, current + (e.key === "ArrowRight" ? step : -step)),
                                    );
                                    setVolume(next);
                                } else if (e.key === "Home") {
                                    setVolume(0);
                                } else if (e.key === "End") {
                                    setVolume(100);
                                }
                            }}
                            role="slider"
                            tabIndex={0}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={activeVolume}
                            className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative cursor-pointer"
                        >
                            <div
                                className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
                                style={{ width: `${activeVolume}%` }}
                            />
                        </div>
                    </div>

                    <button className="hidden sm:block text-[#b3b3b3] hover:text-white">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}