/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { ChevronDown, ListMusic, MoreHorizontal, Pause, Play, Share2, SkipBack, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LikeButton } from "@/components/buttons/like-button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { musicAction, musicStore } from "../music.store";
import { AddToPlaylistModal } from "./add-playlist";

export function MobilePlayer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const store = useStore(musicStore);
    const { currentSong, isPlaying, progressPercentage, currentTime } = store;

    const handleSeek = useCallback((e: React.MouseEvent | React.TouchEvent | PointerEvent) => {
        if (!progressBarRef.current || !currentSong) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        musicAction.updateCurrentTime(Math.floor(p * currentSong.duration));
    }, [currentSong]);

    const onPointerDown = (e: React.PointerEvent) => {
        e.stopPropagation();
        setIsDragging(true); // Disable transitions while dragging
        handleSeek(e);

        const onPointerMove = (moveEvent: PointerEvent) => {
            handleSeek(moveEvent);
        };

        const onPointerUp = () => {
            setIsDragging(false); // Re-enable transitions
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    };

    useEffect(() => {
        controls.start({
            scale: isPlaying ? 1 : 0.85,
            transition: { type: "spring", stiffness: 260, damping: 20 }
        });
    }, [isPlaying, controls]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying) {
            interval = setInterval(() => {
                const latestTime = musicStore.state.currentTime;
                const latestSong = musicStore.state.currentSong;
                if (latestSong && latestTime < latestSong.duration) {
                    musicAction.updateCurrentTime(latestTime + 1);
                } else {
                    musicAction.skipNext();
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    if (!currentSong) return null;

    return (
        <>
            {/* 1. MINI PLAYER */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => { if (info.offset.y < -40) setIsOpen(true); }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="h-20 px-3 flex items-center justify-between relative bg-black/90 backdrop-blur-xl border-t border-white/5 cursor-pointer z-40"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50">
                            <motion.div
                                className="h-full bg-linear-to-r from-purple-500 to-pink-500"
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ ease: "linear", duration: isPlaying ? 1 : 0 }}
                            />
                        </div>
                        {/* ... rest of mini player ... */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img src={currentSong.albumArt} className="w-12 h-12 rounded-lg object-cover" alt="" />
                            <div className="min-w-0 flex-1">
                                <div className="text-white text-sm font-bold truncate">{currentSong.title}</div>
                                <div className="text-white/60 text-xs truncate">{currentSong.artist}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button onClick={musicAction.togglePlay} className="w-12 h-12 flex items-center justify-center">
                                {isPlaying ? <Pause className="w-7 h-7 text-white fill-current" /> : <Play className="w-7 h-7 text-white fill-current ml-1" />}
                            </button>
                            <AddToPlaylistModal />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. FULL SCREEN DRAWER */}
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent className="h-dvh bg-[#121212] border-none p-0 outline-none">
                    <div className="flex flex-col h-full px-8 pt-4 pb-12 overflow-hidden bg-linear-to-b from-[#444] to-[#121212]">
                        {/* Header Section */}
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

                        <div className="flex-1 flex items-center justify-center py-4">
                            <motion.img animate={controls} src={currentSong.albumArt} className="aspect-square w-full max-w-[320px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] object-cover" />
                        </div>

                        <div className="mt-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <h2 className="text-3xl font-black text-white truncate">{currentSong.title}</h2>
                                    <p className="text-xl text-white/60 truncate font-medium">{currentSong.artist}</p>
                                </div>
                                <LikeButton isLiked={currentSong.isLiked} iconSize="medium" onClick={() => musicAction.toggleLike(currentSong)} />
                                <AddToPlaylistModal />
                            </div>

                            {/* --- THE DRAGGABLE PROGRESS BAR --- */}
                            <div className="space-y-3">
                                <div
                                    ref={progressBarRef}
                                    onPointerDown={onPointerDown}
                                    className="h-6 flex items-center w-full group cursor-pointer touch-none relative"
                                >
                                    {/* Rail */}
                                    <div className="h-1.5 w-full bg-white/10 rounded-full relative overflow-visible">
                                        {/* Filled Part */}
                                        <motion.div
                                            className="h-full bg-white rounded-full absolute left-0 top-0"
                                            animate={{ width: `${progressPercentage}%` }}
                                            // When dragging, duration is 0 for instant feedback. 
                                            // When playing, duration is 1s for smooth movement.
                                            transition={{
                                                ease: "linear",
                                                duration: isDragging ? 0 : (isPlaying ? 1 : 0.2)
                                            }}
                                        />

                                        {/* Drag Circle (Thumb) */}
                                        <motion.div
                                            className="absolute top-1/2 -translate-y-1/2 size-4 bg-white rounded-full shadow-xl"
                                            animate={{
                                                left: `${progressPercentage}%`,
                                                scale: isDragging ? 1.4 : 1
                                            }}
                                            transition={{
                                                left: { ease: "linear", duration: isDragging ? 0 : (isPlaying ? 1 : 0.2) },
                                                scale: { type: "spring", stiffness: 300, damping: 20 }
                                            }}
                                            style={{ x: "-50%" }} // Center the thumb on the progress line
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between text-[11px] text-white/40 font-bold tabular-nums">
                                    <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                                    <span>{Math.floor(currentSong.duration / 60)}:{(currentSong.duration % 60).toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <button className="text-white/40"><Share2 className="w-6 h-6" /></button>
                                <div className="flex items-center gap-8">
                                    <button onClick={musicAction.skipPrevious} className="text-white"><SkipBack className="w-9 h-9 fill-current" /></button>
                                    <button onClick={musicAction.togglePlay} className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl">
                                        {isPlaying ? <Pause className="w-10 h-10 text-black fill-current" /> : <Play className="w-10 h-10 text-black fill-current ml-1" />}
                                    </button>
                                    <button onClick={musicAction.skipNext} className="text-white"><SkipForward className="w-9 h-9 fill-current" /></button>
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