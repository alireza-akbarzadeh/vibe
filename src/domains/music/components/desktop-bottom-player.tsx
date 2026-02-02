/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */

import { useStore } from "@tanstack/react-store";
import {
    ListMusic, Maximize2, Mic2, MonitorSpeaker, Pause,
    PictureInPicture2, Play, PlusCircle, Repeat, Shuffle,
    SkipBack, SkipForward, Volume2, VolumeX
} from "lucide-react";
import { useEffect, useRef } from "react";
import { LikeButton } from "@/components/buttons/like-button";
import { cn } from "@/lib/utils";
import { musicAction, musicStore } from "../music.store";

export function DesktopPlayer() {
    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeBarRef = useRef<HTMLDivElement>(null);

    // Connect to the centralized store
    const store = useStore(musicStore);
    const {
        currentSong, isPlaying, currentTime,
        progressPercentage, volume, isMuted
    } = store;

    // Handle Auto-increment of time
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentTime < currentSong.duration) {
            interval = setInterval(() => {
                musicAction.updateCurrentTime(currentTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentSong.duration, currentTime, isPlaying]);

    const handleSeek = (
        e: React.MouseEvent<HTMLDivElement>,
        ref: React.RefObject<HTMLDivElement | null>,
        callback: (p: number) => void
    ) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        callback(p);
    };

    const formatTime = (s: number) =>
        `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

    if (!currentSong) return null;

    return (
        <div className="h-24 px-4 flex items-center justify-between gap-4 bg-[#121212] border-t border-white/5">
            {/* Left Section: Song Info */}
            <div className="flex items-center gap-4 w-[30%] min-w-0">
                <div className="relative group shrink-0">
                    <img
                        src={currentSong.albumArt}
                        className="w-14 h-14 rounded shadow-2xl object-cover"
                        alt={currentSong.title}
                    />
                    <button
                        onClick={() => document.querySelector('video')?.requestPictureInPicture()}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/60 rounded-full p-0.5 transition-opacity"
                    >
                        <PictureInPicture2 className="w-3 h-3 text-white" />
                    </button>
                </div>
                <div className="min-w-0">
                    <div className="text-white text-[14px] font-bold truncate hover:underline cursor-pointer">
                        {currentSong.title}
                    </div>
                    <div className="text-[#b3b3b3] text-[11px] truncate hover:underline cursor-pointer hover:text-white">
                        {currentSong.artist}
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-2">
                    <LikeButton
                        isLiked={currentSong.isLiked}
                        onClick={() => musicAction.toggleLike(currentSong)}
                        className="text-[#b3b3b3] hover:text-white transition-colors"
                    />
                    <button
                        onClick={() => musicAction.openAddToPlaylist(currentSong)}
                        className="text-[#b3b3b3] hover:text-white transition-colors"
                    >
                        <PlusCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Center Section: Controls & Progress */}
            <div className="flex-1 max-w-[45%] flex flex-col items-center">
                <div className="flex items-center gap-6 mb-2">
                    <button className="text-[#b3b3b3] hover:text-white transition-colors">
                        <Shuffle className="w-4 h-4" />
                    </button>
                    <button
                        onClick={musicAction.skipPrevious}
                        className="text-[#b3b3b3] hover:text-white transition-colors"
                    >
                        <SkipBack className="w-5 h-5 fill-current" />
                    </button>
                    <button
                        onClick={musicAction.togglePlay}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5 text-black fill-current" />
                        ) : (
                            <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                        )}
                    </button>
                    <button
                        onClick={musicAction.skipNext}
                        className="text-[#b3b3b3] hover:text-white transition-colors"
                    >
                        <SkipForward className="w-5 h-5 fill-current" />
                    </button>
                    <button className="text-[#b3b3b3] hover:text-white transition-colors">
                        <Repeat className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2 w-full">
                    <span className="text-[11px] text-[#a7a7a7] tabular-nums w-10 text-right">
                        {formatTime(currentTime)}
                    </span>
                    <div
                        ref={progressBarRef}
                        onClick={(e) => handleSeek(e, progressBarRef, (p) =>
                            musicAction.updateCurrentTime(Math.floor(p * currentSong.duration))
                        )}
                        className="flex-1 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer relative"
                    >
                        <div
                            className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full group-hover:bg-purple-400"
                            style={{ width: `${progressPercentage}%` }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-xl transition-opacity"
                            style={{ left: `calc(${progressPercentage}% - 6px)` }}
                        />
                    </div>
                    <span className="text-[11px] text-[#a7a7a7] tabular-nums w-10">
                        {formatTime(currentSong.duration)}
                    </span>
                </div>
            </div>

            {/* Right Section: Volume & View Toggles */}
            <div className="flex items-center gap-3 w-[30%] justify-end">
                <button onClick={musicAction.toggleLyrics}>
                    <Mic2 className={cn("w-4 h-4 transition-colors", store.showLyrics ? "text-purple-500" : "text-[#b3b3b3] hover:text-white")} />
                </button>
                <button onClick={musicAction.toggleQueue}>
                    <ListMusic className={cn("w-4 h-4 transition-colors", store.showQueue ? "text-purple-500" : "text-[#b3b3b3] hover:text-white")} />
                </button>
                <button onClick={musicAction.toggleDevices}>
                    <MonitorSpeaker className={cn("w-4 h-4 transition-colors", store.showDevices ? "text-purple-500" : "text-[#b3b3b3] hover:text-white")} />
                </button>

                <div className="flex items-center gap-2 w-32 group">
                    <button onClick={() => musicStore.setState(s => ({ ...s, isMuted: !s.isMuted }))}>
                        {isMuted || volume === 0 ? (
                            <VolumeX className="w-5 h-5 text-[#b3b3b3]" />
                        ) : (
                            <Volume2 className="w-5 h-5 text-[#b3b3b3]" />
                        )}
                    </button>
                    <div
                        ref={volumeBarRef}
                        onClick={(e) => handleSeek(e, volumeBarRef, (p) =>
                            musicStore.setState(s => ({ ...s, volume: p, isMuted: false }))
                        )}
                        className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative cursor-pointer"
                    >
                        <div
                            className="h-full bg-white group-hover:bg-purple-500 rounded-full transition-colors"
                            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                        />
                    </div>
                </div>

                <button onClick={musicAction.toggleFullscreen}>
                    <Maximize2 className={cn("w-4 h-4 transition-colors", store.isFullscreen ? "text-purple-500" : "text-[#b3b3b3] hover:text-white")} />
                </button>
            </div>
        </div>
    );
}