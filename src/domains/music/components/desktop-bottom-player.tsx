import {
    Heart, ListMusic, Maximize2, Mic2, MonitorSpeaker, Pause,
    PictureInPicture2, Play, PlusCircle, Repeat, Shuffle,
    SkipBack, SkipForward, Volume2, VolumeX
} from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { PlayerComponentProps } from "./bottom-player";



export function DesktopPlayer(props: PlayerComponentProps) {
    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeBarRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="h-24 px-4 flex items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-4 w-[30%] min-w-0">
                <div className="relative group shrink-0">
                    <img
                        src={props.currentSong.albumArt}
                        className="w-14 h-14 rounded shadow-2xl object-cover"
                        alt={props.currentSong.title}
                    />
                    <button
                        onClick={() => document.querySelector('video')?.requestPictureInPicture()}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/60 rounded-full p-0.5 transition-opacity"
                    >
                        <PictureInPicture2 className="w-3 h-3 text-white" />
                    </button>
                </div>
                <div className="min-w-0">
                    <div className="text-white text-[14px] font-bold truncate">{props.currentSong.title}</div>
                    <div className="text-[#b3b3b3] text-[11px] truncate">{props.currentSong.artist}</div>
                </div>
                <div className="flex items-center gap-3 ml-2">
                    <button
                        onClick={props.toggleLike}
                        className={cn("transition-colors", props.isLiked ? "text-pink-500" : "text-[#b3b3b3] hover:text-white")}
                    >
                        <Heart className={cn("w-5 h-5", props.isLiked && "fill-current")} />
                    </button>
                    <button onClick={props.openAdd} className="text-[#b3b3b3] hover:text-white transition-colors">
                        <PlusCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Center Section */}
            <div className="flex-1 max-w-[45%] flex flex-col items-center">
                <div className="flex items-center gap-6 mb-2">
                    <button onClick={props.toggleShuffle} className={cn("transition-colors", props.isShuffle ? "text-purple-500" : "text-[#b3b3b3]")}>
                        <Shuffle className="w-4 h-4" />
                    </button>
                    <button onClick={props.onPrevious} className="text-[#b3b3b3] hover:text-white transition-colors">
                        <SkipBack className="w-5 h-5 fill-current" />
                    </button>
                    <button
                        onClick={props.onPlayPause}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {props.isPlaying ? <Pause className="w-5 h-5 text-black fill-current" /> : <Play className="w-5 h-5 text-black fill-current ml-0.5" />}
                    </button>
                    <button onClick={props.onNext} className="text-[#b3b3b3] hover:text-white transition-colors">
                        <SkipForward className="w-5 h-5 fill-current" />
                    </button>
                    <button className="text-[#b3b3b3] hover:text-white transition-colors">
                        <Repeat className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-2 w-full">
                    <span className="text-[11px] text-[#a7a7a7] tabular-nums w-10 text-right">{formatTime(props.currentTime)}</span>
                    <div
                        ref={progressBarRef}
                        onClick={(e) => handleSeek(e, progressBarRef, (p) => props.onTimeChange(Math.floor(p * props.duration)))}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                            const step = 5; // seconds per arrow key press
                            let newTime = props.currentTime;
                            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                                e.preventDefault();
                                newTime = Math.max(0, props.currentTime - step);
                            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                                e.preventDefault();
                                newTime = Math.min(props.duration, props.currentTime + step);
                            } else if (e.key === "Home") {
                                e.preventDefault();
                                newTime = 0;
                            } else if (e.key === "End") {
                                e.preventDefault();
                                newTime = props.duration;
                            } else {
                                return;
                            }
                            props.onTimeChange(Math.floor(newTime));
                        }}
                        role="slider"
                        tabIndex={0}
                        aria-label="Seek"
                        aria-valuemin={0}
                        aria-valuemax={props.duration}
                        aria-valuenow={props.currentTime}
                        className="flex-1 h-1 bg-[#4d4d4d] rounded-full group cursor-pointer relative"
                    >
                        <div className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${props.progressPercentage}%` }} />
                        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-xl transition-opacity" style={{ left: `calc(${props.progressPercentage}% - 6px)` }} />
                    </div>
                    <span className="text-[11px] text-[#a7a7a7] tabular-nums w-10">{formatTime(props.duration)}</span>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 w-[30%] justify-end">
                <button onClick={props.onToggleLyrics}><Mic2 className="w-4 h-4 text-[#b3b3b3] hover:text-white transition-colors" /></button>
                <button onClick={props.onToggleQueue}><ListMusic className="w-4 h-4 text-[#b3b3b3] hover:text-white transition-colors" /></button>
                <button onClick={props.onToggleDevices}><MonitorSpeaker className="w-4 h-4 text-[#b3b3b3] hover:text-white transition-colors" /></button>
                <div className="flex items-center gap-2 w-32 group">
                    <button onClick={props.toggleMute}>
                        {props.isMuted || props.volume === 0 ? <VolumeX className="w-5 h-5 text-[#b3b3b3]" /> : <Volume2 className="w-5 h-5 text-[#b3b3b3]" />}
                    </button>
                    <div
                        ref={volumeBarRef}
                        onClick={(e) => handleSeek(e, volumeBarRef, (p) => props.setVolume(Math.round(p * 100)))}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                            const step = 5;
                            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                                e.preventDefault();
                                props.setVolume(Math.max(0, props.activeVolume - step));
                            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                                e.preventDefault();
                                props.setVolume(Math.min(100, props.activeVolume + step));
                            } else if (e.key === "Home") {
                                e.preventDefault();
                                props.setVolume(0);
                            } else if (e.key === "End") {
                                e.preventDefault();
                                props.setVolume(100);
                            }
                        }}
                        role="slider"
                        tabIndex={0}
                        aria-label="Volume"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={props.activeVolume}
                        className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative cursor-pointer"
                    >
                        <div className="h-full bg-white group-hover:bg-purple-500 rounded-full transition-colors" style={{ width: `${props.activeVolume}%` }} />
                    </div>
                </div>
                <button onClick={props.onToggleFullscreen}><Maximize2 className="w-4 h-4 text-[#b3b3b3] hover:text-white transition-colors" /></button>
            </div>
        </div>
    );
}