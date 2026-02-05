import { motion } from "framer-motion"
import { useLibraryStore } from "../../store/library-store";

export const LibrarySidebarNowPlaying = ({ isOpen }: { isOpen: boolean }) => {
    const currentTrack = useLibraryStore((s) => s.player.currentTrack);
    const isPlaying = useLibraryStore((s) => s.player.isPlaying);

    if (!currentTrack || !isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 mt-4 rounded-3xl bg-primary/10 border border-primary/20 backdrop-blur-md"
        >
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 shrink-0">
                    <img
                        src={currentTrack.cover || currentTrack.cover}
                        alt={currentTrack.title}
                        className="w-full h-full rounded-lg object-cover"
                    />
                    {isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                            <div className="flex gap-0.5 h-3 items-end">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: ["20%", "100%", "20%"] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                                        className="w-1 bg-white rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-black truncate text-primary uppercase tracking-tighter">Live Now</p>
                    <p className="text-[11px] font-bold truncate text-foreground leading-tight">{currentTrack.title}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{currentTrack.artist}</p>
                </div>
            </div>
        </motion.div>
    );
};
