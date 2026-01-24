import { AnimatePresence, motion } from "framer-motion"
import { Play, RotateCw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { PlayerControls } from "./play-control";
import { useVideoController } from "./useVideoController";
import { useVideoResume } from "./useVideoResume";
import { formatTime } from "./utils";
import { Video } from "./video";
import { VideoOverlay } from "./video-overlay";

type VideoPlayerProps = {
    src: string;
    videoName?: string;
    year?: string;
    videoPoster?: string;
    videoId: string
};

export function VideoPlayer({ src, videoPoster, videoName, year, videoId = "13123" }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Logic extraction (Now includes isWaiting)
    const {
        isPlaying, currentTime, duration, togglePlay, skip, isWaiting
    } = useVideoController(videoRef, videoId);

    // IDLE LOGIC: Hide UI when mouse is still
    const handleMouseMove = () => {
        setIsIdle(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

        if (isPlaying) {
            idleTimerRef.current = setTimeout(() => {
                setIsIdle(true);
            }, 3000);
        }
    };

    // Determine if UI should be visible
    const showUI = isHovered && !isIdle;

    const [buffered, setBuffered] = useState(0);

    // Run this on timeUpdate or progress event
    const handleProgress = () => {
        if (videoRef.current && duration > 0) {
            const video = videoRef.current;
            if (video.buffered.length > 0) {
                // Get the end time of the last buffered range
                const lastBufferedTime = video.buffered.end(video.buffered.length - 1);
                setBuffered((lastBufferedTime / duration) * 100);
            }
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            // Find the container div and request fullscreen
            videoRef.current?.closest('div')?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const [showVolumeHUD, setShowVolumeHUD] = useState(false);
    const hudTimerRef = useRef<NodeJS.Timeout | null>(null);

    // In your controller or player, watch for volume changes to show HUD
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleVolumeHUD = () => {
            setShowVolumeHUD(true);
            if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
            hudTimerRef.current = setTimeout(() => setShowVolumeHUD(false), 1000);
        };

        video.addEventListener("volumechange", handleVolumeHUD);
        return () => video.removeEventListener("volumechange", handleVolumeHUD);
    }, []);

    const [showSpeedHUD, setShowSpeedHUD] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState(1);
    const speedHudTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleRateChange = () => {
            setCurrentSpeed(video.playbackRate);
            setShowSpeedHUD(true);

            if (speedHudTimerRef.current) clearTimeout(speedHudTimerRef.current);
            speedHudTimerRef.current = setTimeout(() => setShowSpeedHUD(false), 1000);
        };

        video.addEventListener("ratechange", handleRateChange);
        return () => video.removeEventListener("ratechange", handleRateChange);
    }, []);

    const { resumeData, handleResume, handleRestart } = useVideoResume(videoRef, videoId);


    return (
        <div
            className={`relative h-screen w-full bg-black rounded-3xl overflow-hidden group shadow-2xl ${isIdle ? 'cursor-none' : 'cursor-default'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsIdle(false);
            }}
            onMouseMove={handleMouseMove}
            onDoubleClick={toggleFullscreen}
        >
            <Video
                ref={videoRef}
                src={src}
                onProgress={handleProgress}
                onTimeUpdate={handleProgress}
                className="w-full h-full object-contain" />

            {/* Poster layer */}
            {!isPlaying && !currentTime && (
                <img src={videoPoster} alt={videoName} className="absolute inset-0 w-full h-full object-cover" />
            )}

            {/* resume */}
            <AnimatePresence>
                {showResume && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-32 left-8 z-[60] bg-zinc-900/90 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-4"
                    >
                        <div className="bg-purple-500/20 p-2 rounded-lg">
                            <RotateCw className="size-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold">Resume watching?</p>
                            <p className="text-zinc-400 text-xs">You left off at {formatTime(savedTime)}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="ghost" onClick={() => setShowResume(false)} className="text-zinc-500 hover:text-white">
                                Restart
                            </Button>
                            <Button size="sm" onClick={handleResume} className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg">
                                Resume
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* showSpeedHUD */}
            <AnimatePresence>
                {showSpeedHUD && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-6 py-4 rounded-3xl z-50 pointer-events-none flex flex-col items-center gap-2 border border-white/10 shadow-2xl"
                    >
                        <div className="flex items-center gap-2">
                            <Play className="size-6 text-purple-400 fill-purple-400" />
                            <span className="text-2xl font-black text-white tracking-tighter tabular-nums">
                                {currentSpeed.toFixed(2)}x
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                            Playback Speed
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* sound visual */}
            <AnimatePresence>
                {showVolumeHUD && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-4 right-4  bg-black/60 backdrop-blur-md p-4 rounded-2xl z-50 pointer-events-none flex flex-col items-center gap-2"
                    >
                        <Volume2 className="size-8 text-white" />
                        <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 transition-all"
                                style={{ width: `${videoRef.current ? videoRef.current.volume * 100 : 0}%` }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LOADING SPINNER */}
            <AnimatePresence>
                {isWaiting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-50"
                    >
                        {/* Custom CSS Spinner */}
                        <div className="relative flex items-center justify-center">
                            <div className="size-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                            <div className="absolute size-12 border-4 border-pink-500/10 border-b-pink-500 rounded-full animate-spin-slow" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* UI LAYER */}
            <VideoOverlay
                isHovered={showUI}
                onTogglePlay={togglePlay}
                onSkip={(dir) => skip(dir === "forward" ? 10 : -10)}
            >
                <PlayerControls
                    isHovered={showUI}
                    buffered={buffered}
                    videoName={videoName as string}
                    year={year as string}
                    state={{ isPlaying, currentTime, duration }}
                    actions={{ togglePlay, skip }}
                    videoRef={videoRef}
                />
            </VideoOverlay>
        </div>
    );
}