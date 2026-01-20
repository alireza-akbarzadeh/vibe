import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type VideoControlsProps = {
    videoRef: React.RefObject<HTMLVideoElement | null>;
};

export function SoundControls({ videoRef }: VideoControlsProps) {
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const volumeRef = useRef<HTMLDivElement>(null);

    // Sync volume and mute state with video element
    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current.volume = volume;
        videoRef.current.muted = isMuted;
    }, [volume, isMuted, videoRef]);

    // Handle volume bar changes
    const handleVolumeChange = (clientX: number) => {
        if (!volumeRef.current) return;
        const rect = volumeRef.current.getBoundingClientRect();
        const newVolume = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        setVolume(newVolume);
        if (newVolume > 0) setIsMuted(false);
    };

    return (
        <div className="flex items-center space-x-2">
            {/* Mute/Unmute button */}
            <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white p-1 rounded hover:bg-white/20"
            >
                {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
            </button>

            {/* Volume Slider */}
            {/** biome-ignore lint/a11y/useFocusableInteractive: <explanation> */}
            {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
            <div
                ref={volumeRef}
                className="relative w-24 h-1 bg-white/20 rounded cursor-pointer"
                onMouseDown={(e) => {
                    setIsDragging(true);
                    handleVolumeChange(e.clientX);
                }}
                onMouseMove={(e) => {
                    if (isDragging) handleVolumeChange(e.clientX);
                }}
                role="button"
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
            >
                <motion.div
                    className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none"
                    animate={{ width: `${volume * 100}%` }}
                    transition={{ type: "tween", ease: "linear", duration: isDragging ? 0 : 0.1 }}
                />
            </div>
        </div>
    );
}
