import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
    icon: React.ReactNode;
    label?: string;
    onClick?: () => void;
    className?: string;

}
export const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => (
    <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
            if (onClick) {
                e.stopPropagation();
                onClick();
            }
        }}
        // "no-pause" class ensures the video doesn't stop when clicking buttons
        className="no-pause flex flex-col items-center gap-1 outline-none group"
    >
        <div className={cn(
            "flex items-center justify-center rounded-full transition-all",
            "size-10 sm:size-12", // Smaller on mobile, default on tablet/desktop
            "bg-white/10 group-active:bg-white/30" // Subtle glass effect per button
        )}>
            {/* Clone the icon to inject responsive sizing if it's a Lucide icon */}
            {React.isValidElement(icon)
                ? (() => {
                    const el = icon as React.ReactElement<{ className?: string }>;
                    return React.cloneElement(el, {
                        className: cn(el.props?.className, "size-5 sm:size-7")
                    });
                })()
                : icon}
        </div>
        {label && (
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tighter text-white drop-shadow-md">
                {label}
            </span>
        )}
    </motion.button>
);