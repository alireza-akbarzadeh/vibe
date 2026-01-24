import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, RotateCw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "../back-button";
import { PlayButton } from "../play-button";
import { MoreEpisode } from "./more-episode";
import { MoreVideoOptions } from "./more-video-options";
import { SoundControls } from "./SoundControls";
import { SettingVideoOptions } from "./setting-video-options";
import { formatTime } from "./utils";
import { VideoProgressbar } from "./video-progressbar";

interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
}

interface PlayerActions {
    togglePlay: () => void;
    skip: (seconds: number) => void;
    onNext?: () => void;
    onPrevious?: () => void;
}

interface PlayerControlsProps {
    isHovered: boolean;
    videoName: string;
    year: string;
    state: PlayerState;
    actions: PlayerActions;
    buffered: number;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function PlayerControls({
    isHovered,
    videoName,
    year,
    state,
    actions,
    videoRef,
    buffered,
}: PlayerControlsProps) {
    const [currentSpeed, setCurrentSpeed] = useState(1);

    // Sync speed for the badge
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const handleSpeed = () => setCurrentSpeed(video.playbackRate);
        video.addEventListener('ratechange', handleSpeed);
        return () => video.removeEventListener('ratechange', handleSpeed);
    }, [videoRef]);



    return (
        <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

            {/* TOP BAR */}
            <div className="p-6 flex justify-between items-start z-20">
                <BackButton position="none" title={videoName} />
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex md:hidden gap-2">
                        <MoreEpisode />
                        <SettingVideoOptions videoRef={videoRef} />
                    </div>
                </div>
            </div>

            {/* MIDDLE: PLAYBACK CONTROLS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6 md:gap-14 z-20" onClick={(e) => e.stopPropagation()}>
                <Button
                    variant="ghost" size="icon"
                    className="text-white hover:bg-white/20 rounded-full size-12 disabled:opacity-30 active:scale-90"
                    disabled={!actions.onPrevious}
                    onClick={actions.onPrevious}
                >
                    <SkipBack className="size-8 fill-current" />
                </Button>

                <Button
                    variant="ghost" size="icon"
                    className="text-white hover:bg-white/20 rounded-full size-20 active:scale-95"
                    onClick={() => actions.skip(-10)}
                >
                    <div className="relative flex items-center justify-center">
                        <RotateCcw className="size-16" />
                        <span className="absolute text-[10px] font-bold mt-1">10</span>
                    </div>
                </Button>

                <PlayButton value={state.isPlaying} onOpenChange={actions.togglePlay} />

                <Button
                    variant="ghost" size="icon"
                    className="text-white hover:bg-white/20 rounded-full size-20 active:scale-95"
                    onClick={() => actions.skip(10)}
                >
                    <div className="relative flex items-center justify-center">
                        <RotateCw className="size-16" />
                        <span className="absolute text-[10px] font-bold mt-1">10</span>
                    </div>
                </Button>

                <Button
                    variant="ghost" size="icon"
                    className="text-white hover:bg-white/20 rounded-full size-12 disabled:opacity-30 active:scale-90"
                    disabled={!actions.onNext}
                    onClick={actions.onNext}
                >
                    <SkipForward className="size-8 fill-current" />
                </Button>
            </div>

            {/* BOTTOM BAR */}
            <div className="absolute bottom-0 inset-x-0 p-8 bg-linear-to-t from-black/90 via-black/40 to-transparent z-20">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{videoName}</h2>
                        <p className="text-white/60 text-sm font-medium">{year} • Action</p>
                    </div>

                    <VideoProgressbar
                        buffered={buffered}
                        currentTime={state.currentTime}
                        duration={state.duration}
                        isPlaying={state.isPlaying}
                        onSeek={(t) => { if (videoRef.current) videoRef.current.currentTime = t }}
                        onPause={() => videoRef.current?.pause()}
                        onPlay={() => videoRef.current?.play()}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <SoundControls videoRef={videoRef} />

                            {/* TIME & SPEED BADGE */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-mono text-white/80 tabular-nums">
                                    {formatTime(state.currentTime)} <span className="text-white/30 mx-1">/</span> {formatTime(state.duration)}
                                </span>
                                <AnimatePresence>
                                    {currentSpeed !== 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-400 font-bold uppercase"
                                        >
                                            {currentSpeed}x
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <div className="hidden md:flex gap-2">
                                <MoreEpisode />
                                <MoreVideoOptions videoRef={videoRef} />
                                <SettingVideoOptions videoRef={videoRef} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}