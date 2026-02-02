import { useStore } from "@tanstack/react-store";
import { motion, useAnimation } from "framer-motion";
import { ChevronDown, Heart, ListMusic, MoreHorizontal, Pause, Play, Share2, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { musicStore } from "../music.store";
import { AddToPlaylistModal } from "./add-playlist";
import type { PlayerComponentProps } from "./bottom-player";

export function MobilePlayer(props: PlayerComponentProps) {
    const [isOpen, setIsOpen] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const { library } = useStore(musicStore)
    // Album art animation logic (Spotify style)
    useEffect(() => {
        controls.start({ scale: props.isPlaying ? 1 : 0.85 });
    }, [props.isPlaying, controls]);

    const handleSeek = (e: React.MouseEvent | React.TouchEvent) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        props.onTimeChange(Math.floor(p * props.duration));
    };

    return (
        <>
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                    // Open if dragged up significantly
                    if (info.offset.y < -50) setIsOpen(true);
                }}
                className="h-20 px-3 flex items-center justify-between relative bg-black/40"
            >
                {/* Scrub-able Progress Bar */}
                <div
                    ref={progressBarRef}
                    onPointerDown={handleSeek}
                    className="absolute top-0 left-0 right-0 h-1.5 bg-white/10 cursor-pointer z-50"
                >
                    <div
                        className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-150"
                        style={{ width: `${props.progressPercentage}%` }}
                    />
                </div>

                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                        src={props.currentSong.albumArt}
                        className="w-12 h-12 rounded-lg object-cover shadow-lg"
                        alt={props.currentSong.title}
                    />
                    <div className="min-w-0 flex-1">
                        <div className="text-white text-sm font-bold truncate">
                            {props.currentSong.title}
                        </div>
                        <div className="text-[#b3b3b3] text-xs truncate">
                            {props.currentSong.artist}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-2">
                    <button
                        onClick={props.onPlayPause}
                        className="w-12 h-12 flex items-center justify-center active:scale-90 transition-transform"
                    >
                        {props.isPlaying ? (
                            <Pause className="w-7 h-7 text-white fill-current" />
                        ) : (
                            <Play className="w-7 h-7 text-white fill-current ml-1" />
                        )}
                    </button>
                    <AddToPlaylistModal />
                </div>
            </motion.div>

            {/* 2. FULL SCREEN DRAWER */}
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent className="h-dvh bg-[#121212] border-none p-0 outline-none">
                    <div className="flex flex-col h-full px-6 pt-2 pb-10 overflow-hidden bg-linear-to-b from-[#333] to-[#121212]">
                        {/* Top Bar */}
                        <div className="flex items-center justify-between mb-8">
                            <button onClick={() => setIsOpen(false)} className="p-2 -ml-2">
                                <ChevronDown className="w-6 h-6 text-white" />
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Playing From Album</span>
                                <span className="text-xs text-white font-medium truncate max-w-37.5">{props.currentSong.album}</span>
                            </div>
                            <button className="p-2 -mr-2"><MoreHorizontal className="w-6 h-6 text-white" /></button>
                        </div>

                        {/* Animated Album Art */}
                        <div className="flex-1 flex items-center justify-center py-4">
                            <motion.img
                                animate={controls}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                src={props.currentSong.albumArt}
                                className="aspect-square w-full max-w-[320px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover"
                            />
                        </div>

                        {/* Song Info */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="min-w-0">
                                    <h2 className="text-2xl font-bold text-white truncate">{props.currentSong.title}</h2>
                                    <p className="text-lg text-white/60 truncate">{props.currentSong.artist}</p>
                                </div>
                                <button onClick={props.toggleLike}>
                                    <Heart className={cn("w-7 h-7", props.isLiked ? "text-purple-500 fill-current" : "text-white")} />
                                </button>
                            </div>

                            {/* Full Progress Slider */}
                            <div className="space-y-2">
                                <div
                                    className="h-1.5 w-full bg-white/20 rounded-full relative overflow-hidden"
                                    onPointerDown={handleSeek}
                                >
                                    <div
                                        className="h-full bg-white"
                                        style={{ width: `${props.progressPercentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[11px] text-white/60 font-medium tabular-nums">
                                    <span>{Math.floor(props.currentTime / 60)}:{(props.currentTime % 60).toString().padStart(2, '0')}</span>
                                    <span>{Math.floor(props.duration / 60)}:{(props.duration % 60).toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Main Controls */}
                            <div className="flex items-center justify-between mt-6">
                                <button className="text-white/60"><Share2 className="w-5 h-5" /></button>
                                <div className="flex items-center gap-8">
                                    <button onClick={props.onPrevious} className="text-white"><SkipBack className="w-9 h-9 fill-current" /></button>
                                    <button
                                        onClick={props.onPlayPause}
                                        className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform"
                                    >
                                        {props.isPlaying ? (
                                            <Pause className="w-10 h-10 text-black fill-current" />
                                        ) : (
                                            <Play className="w-10 h-10 text-black fill-current ml-1" />
                                        )}
                                    </button>
                                    <button onClick={props.onNext} className="text-white"><SkipForward className="w-9 h-9 fill-current" /></button>
                                </div>
                                <button onClick={props.onToggleQueue} className="text-white/60"><ListMusic className="w-6 h-6" /></button>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}