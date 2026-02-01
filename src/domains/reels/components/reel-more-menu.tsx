import { AnimatePresence, motion } from 'framer-motion';
import {
    Ban,
    Download, EyeOff, Flag,
    Link2,
    Settings,
    UserMinus
} from 'lucide-react';
import { cn } from '@/lib/utils';


type ReelActionType = 'copy' | 'download' | 'settings' | 'hide' | 'unfollow' | 'block' | 'report';

interface MenuGridItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}


interface MenuListItemProps extends MenuGridItemProps {
    isLast?: boolean;
}

interface ReelMoreMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onAction: (type: ReelActionType) => void;
}

export function ReelMoreMenu({ isOpen, onClose, onAction }: ReelMoreMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 z-[70] rounded-t-[2.5rem] bg-[#121212] p-6 pb-12 border-t border-white/10 shadow-2xl"
                    >
                        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/20" />

                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <MenuGridItem icon={<Link2 />} label="Link" onClick={() => onAction('copy')} />
                            <MenuGridItem icon={<Download />} label="Download" onClick={() => onAction('download')} />
                            <MenuGridItem icon={<Settings />} label="Settings" onClick={() => onAction('settings')} />
                            <MenuGridItem icon={<EyeOff />} label="Hide" onClick={() => onAction('hide')} />
                        </div>

                        <div className="space-y-1 overflow-hidden rounded-2xl bg-white/5">
                            <MenuListItem icon={<UserMinus className="text-orange-400" />} label="Unfollow" onClick={() => onAction('unfollow')} />
                            <MenuListItem icon={<Ban className="text-red-500" />} label="Block" onClick={() => onAction('block')} />
                            <MenuListItem icon={<Flag className="text-red-500" />} label="Report" onClick={() => onAction('report')} isLast />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

const MenuGridItem = ({ icon, label, onClick }: MenuGridItemProps) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
        <div className="flex size-14 items-center justify-center rounded-full bg-white/10 text-white active:scale-90 transition-all group-hover:bg-white/20">
            {icon}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white/80">{label}</span>
    </button>
);

const MenuListItem = ({ icon, label, onClick, isLast }: MenuListItemProps) => (
    <button
        onClick={onClick}
        className={cn(
            "flex w-full items-center gap-4 px-5 py-4 text-sm font-bold uppercase tracking-wide text-white active:bg-white/10 transition-colors",
            !isLast && "border-b border-white/5"
        )}
    >
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
    </button>
);