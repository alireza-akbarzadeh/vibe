import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface VideoOverlayProps {
    onTogglePlay: () => void;
    onSkip: (dir: "forward" | "backward") => void;
    isHovered: boolean;
    children: React.ReactNode;
}

export function VideoOverlay({ onTogglePlay, onSkip, isHovered, children }: VideoOverlayProps) {
    const [skipType, setSkipType] = useState<null | "forward" | "backward">(null);

    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) {
            onSkip("backward");
            triggerVisual("backward");
        } else {
            onSkip("forward");
            triggerVisual("forward");
        }
    };

    const triggerVisual = (dir: "forward" | "backward") => {
        setSkipType(dir);
        setTimeout(() => setSkipType(null), 800);
    };

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
            className="absolute inset-0 z-10"
            onDoubleClick={handleDoubleClick}
            onClick={(e) => e.detail === 1 && onTogglePlay()}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Skip Visual Feedback */}
            <AnimatePresence>
                {skipType && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-black/50 p-6 rounded-full">
                            {skipType === "forward" ? <ChevronRight size={48} /> : <ChevronLeft size={48} />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {children}
        </div>
    );
}