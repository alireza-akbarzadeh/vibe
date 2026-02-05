import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const SidebarSearchTrigger = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
    <div className="px-4 mb-4">
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/10 transition-all",
                !isOpen && "justify-center"
            )}
        >
            <Search className="w-5 h-5 text-muted-foreground" />
            {isOpen && (
                <div className="flex flex-1 items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Search Library...</span>
                    <span className="text-[10px] font-bold text-muted-foreground/30 border border-white/10 px-1.5 py-0.5 rounded-md">⌘K</span>
                </div>
            )}
        </button>
    </div>
);
