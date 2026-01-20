import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { VIDEOS } from "@/constants/media";
import { PlayButton } from "../play-button";
import { MoreVideoOptions } from "./more-video-options";
import { SoundControls } from "./SoundControls";
import { SettingVideoOptions } from "./setting-video-options";
import { useVideoState } from "./useVIdeoState";
import { Video } from "./video";
import { VideoProgressbar } from "./video-progressbar";

type VideoPlayerProps = {
    src?: string;
    videoName?: string;
    year?: string;
    videoPoster?: string;
};

export function VideoPlayer({
    src = VIDEOS.demo,
    videoPoster = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop",
    year = "2014",
    videoName = "Interstellar",
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { isPlaying, currentTime, duration, setIsPlaying } = useVideoState(videoRef);
    const [skipIndicator, setSkipIndicator] = useState<null | "forward" | "backward">(null);

    // --- Format time for progress bar ---
    const formatTime = (seconds: number) => {
        if (!seconds) return "0:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const triggerSkip = useCallback((direction: "forward" | "backward") => {
        setSkipIndicator(direction);
        setTimeout(() => setSkipIndicator(null), 800);
    }, []);

    // --- Play/Pause handler ---
    const handlePlayPause = (val: boolean) => {
        setIsPlaying(val);
        if (!videoRef.current) return;
        if (val) videoRef.current.play();
        else videoRef.current.pause();
    };

    // --- Keyboard shortcuts ---
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!videoRef.current) return;
            switch (e.code) {
                case "Space":
                    e.preventDefault();
                    handlePlayPause(videoRef.current.paused);
                    break;
                case "ArrowRight":
                    videoRef.current.currentTime += 10;
                    triggerSkip("forward");
                    break;
                case "ArrowLeft":
                    videoRef.current.currentTime -= 10;
                    triggerSkip("backward");
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    videoRef.current.volume = Math.min(videoRef.current.volume + 0.05, 1);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    videoRef.current.volume = Math.max(videoRef.current.volume - 0.05, 0);
                    break;
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [handlePlayPause, triggerSkip]);

    // --- Click zones for skip ---
    const handleClickZone = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeft = e.clientX - rect.left < rect.width / 2;
        if (isLeft) {
            videoRef.current.currentTime -= 10;
            triggerSkip("backward");
        } else {
            videoRef.current.currentTime += 10;
            triggerSkip("forward");
        }
    };

    return (
        <motion.div
            className="mt-2 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => e.stopPropagation()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative mx-auto w-full"
            >
                <div className="aspect-video rounded-3xl bg-linear-to-br from-gray-800 to-gray-900 p-2 shadow-2xl shadow-purple-500/10">
                    <div className="relative h-full rounded-2xl overflow-hidden bg-black">
                        {/* VIDEO */}
                        <Video
                            ref={videoRef}
                            src={src}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity ${isPlaying ? "opacity-100" : "opacity-0"
                                }`}
                        />

                        {/* POSTER */}
                        {!isPlaying && (
                            <img
                                src={videoPoster}
                                alt="Streaming content"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}

                        {/* CLICK TO SKIP ZONES */}
                        <div
                            className="absolute inset-0 flex"
                            onClick={handleClickZone}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleClickZone(e as unknown as React.MouseEvent<HTMLDivElement>);
                                }
                            }}
                            role="button"
                            aria-label="Skip forward/backward"
                            tabIndex={0}
                        >
                            <div className="flex-1 h-full cursor-pointer" />
                        </div>

                        {/* UI OVERLAY */}
                        <motion.div
                            className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-black/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* TOP BAR */}
                            <motion.div
                                className="absolute top-4 left-4 right-4 flex justify-between items-center"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: isHovered ? 0 : -20, opacity: isHovered ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">V</span>
                                    </div>
                                    <span className="hidden sm:block text-white/60 text-sm">Now Playing</span>
                                </div>
                            </motion.div>

                            {/* PLAY BUTTON */}
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PlayButton value={isPlaying} onOpenChange={handlePlayPause} size="large" />
                            </motion.div>

                            {/* BOTTOM CONTROLS */}
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 p-6"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">{videoName}</h3>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-white/60 text-sm">{year} • Sci-Fi</p>
                                    <div className="flex items-center gap-2">
                                        <SoundControls videoRef={videoRef} />
                                        <MoreVideoOptions videoRef={videoRef} />
                                        <SettingVideoOptions />
                                    </div>
                                </div>

                                <VideoProgressbar
                                    currentTime={currentTime}
                                    duration={duration}
                                    isPlaying={isPlaying}
                                    onSeek={(time) => {
                                        if (videoRef.current) videoRef.current.currentTime = time;
                                    }}
                                    onPause={() => videoRef.current?.pause()}
                                    onPlay={() => videoRef.current?.play()}
                                />

                                <div className="flex justify-between text-white/50 text-xs">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* STAND */}
                <div className="mx-auto w-32 h-6 bg-linear-to-b from-gray-700 to-gray-800 rounded-b-lg" />
                <div className="mx-auto w-48 h-2 bg-gray-800 rounded-full" />
            </motion.div>

            {/* Skip Indicator */}
            <AnimatePresence>
                {skipIndicator && (
                    <motion.div
                        key={skipIndicator}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute text-white text-4xl font-bold inset-0 flex items-center justify-center pointer-events-none"
                    >
                        {skipIndicator === "forward" ? <ChevronRight /> : <ChevronLeft />}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
