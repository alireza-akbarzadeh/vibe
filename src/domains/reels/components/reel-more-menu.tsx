import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import {
    Ban,
    ChevronRight,
    Download,
    EyeOff,
    Flag,
    Link2,
    Settings,
    UserMinus
} from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

type ReelActionType = 'copy' | 'download' | 'settings' | 'hide' | 'unfollow' | 'block' | 'report';

interface ReelMoreMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onAction: (type: ReelActionType) => void;
}

export function ReelMoreMenu({ isOpen, onClose, onAction }: ReelMoreMenuProps) {
    // Handle drag-to-close functionality with velocity sensing
    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="absolute inset-0 z-[100] flex items-end justify-center overflow-hidden">
                    {/* Backdrop with premium blur - clickable to close */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-[6px]"
                    />

                    {/* Full-Width Premium Drawer Container */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 28,
                            stiffness: 280,
                            mass: 0.8
                        }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.15}
                        onDragEnd={handleDragEnd}
                        // "no-pause" class ensures video interaction logic doesn't interfere
                        className="relative w-full bg-[#121212] rounded-t-[2.5rem] border-t border-white/10 shadow-[0_-15px_50px_rgba(0,0,0,0.8)] flex flex-col no-pause"
                    >
                        {/* Interactive Drag Handle */}
                        <div className="flex w-full justify-center pt-4 pb-1">
                            <motion.div
                                whileTap={{ scaleX: 1.2 }}
                                className="h-1.5 w-14 rounded-full bg-white/15 transition-colors"
                            />
                        </div>

                        {/* Content Area - Optimized for full-width touch targets */}
                        <div className="px-5 pt-4 pb-12">
                            {/* Primary Grid Actions */}
                            <div className="grid grid-cols-4 gap-4 mb-8">
                                <MenuGridItem
                                    icon={<Link2 className="size-6" />}
                                    label="Link"
                                    onClick={() => onAction('copy')}
                                />
                                <MenuGridItem
                                    icon={<Download className="size-6" />}
                                    label="Save"
                                    onClick={() => onAction('download')}
                                />
                                <MenuGridItem
                                    icon={<Settings className="size-6" />}
                                    label="Manage"
                                    onClick={() => onAction('settings')}
                                />
                                <MenuGridItem
                                    icon={<EyeOff className="size-6" />}
                                    label="Hide"
                                    onClick={() => onAction('hide')}
                                />
                            </div>

                            {/* Secondary List Actions - Full width row items */}
                            <div className="overflow-hidden rounded-[2rem] bg-white/[0.03] border border-white/5">
                                <MenuListItem
                                    icon={<UserMinus className="size-5 text-orange-400" />}
                                    label="Unfollow"
                                    onClick={() => onAction('unfollow')}
                                />
                                <MenuListItem
                                    icon={<Ban className="size-5 text-red-500" />}
                                    label="Block Account"
                                    onClick={() => onAction('block')}
                                />
                                <MenuListItem
                                    icon={<Flag className="size-5 text-red-500" />}
                                    label="Report Content"
                                    onClick={() => onAction('report')}
                                    isLast
                                />
                            </div>

                            {/* Full-width tertiary close button */}
                            <button
                                onClick={onClose}
                                className="mt-6 w-full py-5 rounded-2xl bg-white/[0.04] text-white/40 font-black uppercase tracking-[0.2em] text-[10px] active:bg-white/10 transition-colors border border-white/5"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// --- Specialized Sub-Components ---

const MenuGridItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-3 group outline-none"
    >
        <div className="flex aspect-square w-full max-w-[70px] items-center justify-center rounded-2xl bg-white/[0.04] text-white border border-white/[0.06] active:scale-90 active:bg-white/10 transition-all duration-200 group-hover:border-white/20">
            {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
            {label}
        </span>
    </button>
);

const MenuListItem = ({ icon, label, onClick, isLast }: { icon: React.ReactNode, label: string, onClick: () => void, isLast?: boolean }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex w-full items-center justify-between px-6 py-5 text-sm font-bold tracking-wide text-white/80 active:bg-white/5 transition-all outline-none group",
            !isLast && "border-b border-white/[0.03]"
        )}
    >
        <div className="flex items-center gap-4">
            <span className="shrink-0 group-active:scale-110 transition-transform">{icon}</span>
            <span className="uppercase tracking-widest text-[11px] font-black">{label}</span>
        </div>
        <ChevronRight className="size-4 text-white/10 group-hover:text-white/30 transition-colors" />
    </button>
);