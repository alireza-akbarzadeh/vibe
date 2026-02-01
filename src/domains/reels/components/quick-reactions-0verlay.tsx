import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const reactions = ['❤️', '🔥', '😂', '😮', '😍', '👏'];

interface QuickReactionsProps {
    onReact: (emoji: string) => void;
    selectedEmoji: string | null;
}

export function QuickReactionsOverlay({ onReact, selectedEmoji }: QuickReactionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.8 }}
                    className="flex flex-col items-center gap-1 group outline-none"
                >
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl transition-colors group-hover:bg-white/20 border border-white/5">
                        {selectedEmoji ? (
                            <span className="text-2xl animate-in zoom-in duration-300">{selectedEmoji}</span>
                        ) : (
                            <Smile className="size-7 text-white" />
                        )}
                    </div>
                </motion.button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="left"
                align="center"
                sideOffset={20}
                className={cn(
                    "flex items-center gap-1 p-2 z-[100]",
                    "w-auto min-w-fit max-w-none rounded-full",
                    "bg-black/90 backdrop-blur-2xl border-white/20 shadow-2xl",
                    "animate-in fade-in zoom-in slide-in-from-right-2 duration-200"
                )}
            >
                {reactions.map((emoji, index) => (
                    <DropdownMenuItem
                        key={emoji}
                        /* REMOVED preventDefault: Now it will close on click */
                        onClick={() => onReact(emoji)}
                        className="p-0 focus:bg-transparent cursor-pointer flex items-center justify-center outline-none"
                    >
                        <motion.span
                            initial={{ scale: 0, x: 15 }}
                            animate={{ scale: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                            whileHover={{ scale: 1.4, y: -5 }}
                            className="text-2xl px-2 inline-block select-none"
                        >
                            {emoji}
                        </motion.span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}