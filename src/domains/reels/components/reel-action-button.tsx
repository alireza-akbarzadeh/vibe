import { motion } from 'framer-motion';

interface ActionButtonProps {
    icon: React.ReactNode;
    label?: string;
    onClick?: () => void;
    className?: string;

}
export const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => (
    <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => {
            if (onClick) {
                e.stopPropagation();
                onClick();
            }
        }}
        className="flex flex-col items-center gap-1 outline-none"
    >
        <div className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl transition-colors active:bg-white/60">
            {icon}
        </div>
        {label && <span className="text-[10px] font-black uppercase tracking-tighter text-white drop-shadow-md">{label}</span>}
    </motion.button>
);