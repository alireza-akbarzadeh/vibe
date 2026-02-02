/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */

import { useStore } from "@tanstack/react-store";
import { motion, useAnimation } from "framer-motion";
import { ChevronDown, Heart, ListMusic, MoreHorizontal, Pause, Play, Share2, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { musicAction, musicStore } from "../music.store";
import { AddToPlaylistModal } from "./add-playlist";

export function MobilePlayer() {
    const [isOpen, setIsOpen] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const store = useStore(musicStore);
    const { currentSong, isPlaying, progressPercentage, currentTime } = store;



    useEffect(() => {
        controls.start({ scale: isPlaying ? 1 : 0.85 });
    }, [isPlaying, controls]);

    const handleSeek = (e: React.MouseEvent | React.TouchEvent) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

        // Use the store action
        musicAction.updateCurrentTime(Math.floor(p * currentSong.duration));
    };

    return (
        <>
            {/* 1. MINI PLAYER */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                    if (info.offset.y < -50) setIsOpen(true);
                }}
                onClick={() => setIsOpen(true)} // Clicking anywhere opens the drawer
                className="h-20 px-3 flex items-center justify-between relative bg-black/80 backdrop-blur-lg border-t border-white/5"
            >
                {/* Scrub-able Progress Bar */}
                <div
                    ref={progressBarRef}
                    onClick={(e) => {
                        e.stopPropagation(); // Don't open drawer when clicking progress
                        handleSeek(e);
                    }}
                    className="absolute top-0 left-0 right-0 h-1 bg-white/10 cursor-pointer z-50"
                >
                    <div
                        className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-150"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                        src={currentSong.albumArt}
                        className="w-12 h-12 rounded-lg object-cover shadow-lg"
                        alt={currentSong.title}
                    />
                    <div className="min-w-0 flex-1">
                        <div className="text-white text-sm font-bold truncate">
                            {currentSong.title}
                        </div>
                        <div className="text-[#b3b3b3] text-xs truncate">
                            {currentSong.artist}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={musicAction.togglePlay}
                        className="w-12 h-12 flex items-center justify-center active:scale-90 transition-transform"
                    >
                        {isPlaying ? (
                            <Pause className="w-7 h-7 text-white fill-current" />
                        ) : (
                            <Play className="w-7 h-7 text-white fill-current ml-1" />
                        )}
                    </button>
                    {/* The AddToPlaylistModal uses the store internally now */}
                    <AddToPlaylistModal />
                </div>
            </motion.div>

            {/* 2. FULL SCREEN DRAWER */}
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent className="h-dvh bg-[#121212] border-none p-0 outline-none">
                    <div className="flex flex-col h-full px-6 pt-2 pb-10 overflow-hidden bg-linear-to-b from-[#444] to-[#121212]">
                        {/* Top Bar */}
                        <div className="flex items-center justify-between mb-8">
                            <button onClick={() => setIsOpen(false)} className="p-2 -ml-2">
                                <ChevronDown className="w-8 h-8 text-white" />
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">Playing From Album</span>
                                <span className="text-xs text-white font-bold truncate max-w-[200px] mt-1">{currentSong.album}</span>
                            </div>
                            <button className="p-2 -mr-2"><MoreHorizontal className="w-6 h-6 text-white" /></button>
                        </div>

                        {/* Animated Album Art */}
                        <div className="flex-1 flex items-center justify-center py-4">
                            <motion.img
                                animate={controls}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                src={currentSong.albumArt}
                                className="aspect-square w-full max-w-[320px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] object-cover"
                            />
                        </div>

                        {/* Song Info */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="min-w-0">
                                    <h2 className="text-3xl font-black text-white truncate">{currentSong.title}</h2>
                                    <p className="text-xl text-white/60 truncate font-medium">{currentSong.artist}</p>
                                </div>
                                <button onClick={() => musicAction.togglePin(currentSong.id)}>
                                    <Heart className="w-8 h-8 text-white/40 hover:text-purple-500 transition-colors" />
                                </button>
                            </div>

                            {/* Full Progress Slider */}
                            <div className="space-y-3">
                                <div
                                    className="h-1.5 w-full bg-white/10 rounded-full relative cursor-pointer"
                                    onClick={handleSeek}
                                >
                                    <div
                                        className="h-full bg-white rounded-full relative"
                                        style={{ width: `${progressPercentage}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                                    </div>
                                </div>
                                <div className="flex justify-between text-[11px] text-white/40 font-bold tabular-nums">
                                    <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                                    <span>{Math.floor(currentSong.duration / 60)}:{(currentSong.duration % 60).toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Main Controls */}
                            <div className="flex items-center justify-between mt-8">
                                <button className="text-white/40"><Share2 className="w-6 h-6" /></button>
                                <div className="flex items-center gap-8">
                                    <button onClick={musicAction.skipPrevious} className="text-white active:scale-90 transition-transform">
                                        <SkipBack className="w-9 h-9 fill-current" />
                                    </button>
                                    <button
                                        onClick={musicAction.togglePlay}
                                        className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-90 transition-transform shadow-xl"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-10 h-10 text-black fill-current" />
                                        ) : (
                                            <Play className="w-10 h-10 text-black fill-current ml-1" />
                                        )}
                                    </button>
                                    <button onClick={musicAction.skipNext} className="text-white active:scale-90 transition-transform">
                                        <SkipForward className="w-9 h-9 fill-current" />
                                    </button>
                                </div>
                                <button onClick={musicAction.toggleQueue} className="text-white/40"><ListMusic className="w-6 h-6" /></button>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}