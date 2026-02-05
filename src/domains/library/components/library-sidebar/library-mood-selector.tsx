import { cn } from "@/lib/utils";
import { moods } from "../../layouts/library-app-sidebar";

export const LibraryMoodSelector = ({ isOpen }: { isOpen: boolean }) => {
    if (!isOpen) return null;
    return (
        <div className="px-6 py-2">
            <p className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] mb-3">Vibe Mode</p>
            <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                    <button
                        key={mood.label}
                        className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/3 border border-white/5 hover:border-primary/30 transition-all"
                    >
                        <div className={cn("w-1.5 h-1.5 rounded-full", mood.color)} />
                        <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground uppercase tracking-tighter">
                            {mood.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};