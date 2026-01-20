import { motion } from "framer-motion";
import { useRef, useState } from "react";

interface VideoProgressbarProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
    isPlaying: boolean
    onPause: () => void
    onPlay: () => void
}

export function VideoProgressbar({
    currentTime,
    duration,
    isPlaying,
    onSeek,
    onPause,
    onPlay,
}: VideoProgressbarProps) {
    const barRef = useRef<HTMLDivElement>(null);
    const wasPlayingRef = useRef(false);
    const [isDragging, setIsDragging] = useState(false);

    const progress = duration
        ? (currentTime / duration) * 100
        : 0;

    function seekFromClientX(clientX: number) {
        if (!barRef.current || !duration) return;

        const rect = barRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.min(Math.max(x / rect.width, 0), 1);

        onSeek(percent * duration);
    }

    /* ───────────────── Mouse ───────────────── */

    function handleMouseDown(e: React.MouseEvent) {
        e.preventDefault();

        wasPlayingRef.current = isPlaying;
        onPause();
        setIsDragging(true);

        seekFromClientX(e.clientX);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }

    function handleMouseMove(e: MouseEvent) {
        seekFromClientX(e.clientX);
    }

    function handleMouseUp() {
        setIsDragging(false);

        if (wasPlayingRef.current) {
            onPlay();
        }

        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    }

    /* ───────────────── Touch ───────────────── */

    function handleTouchStart(e: React.TouchEvent) {
        wasPlayingRef.current = isPlaying;
        onPause();
        setIsDragging(true);

        seekFromClientX(e.touches[0].clientX);
    }

    function handleTouchMove(e: React.TouchEvent) {
        seekFromClientX(e.touches[0].clientX);
    }

    function handleTouchEnd() {
        setIsDragging(false);

        if (wasPlayingRef.current) {
            onPlay();
        }
    }

    return (
        <div
            ref={barRef}
            role="slider"
            tabIndex={0}
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative h-1 cursor-pointer bg-white/20 rounded-full overflow-hidden mb-3"
        >
            <motion.div
                animate={{ width: `${progress}%` }}
                transition={{
                    type: "tween",
                    ease: "linear",
                    duration: isDragging ? 0 : 0.15,
                }}
                className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none"
            />
        </div>
    );
}