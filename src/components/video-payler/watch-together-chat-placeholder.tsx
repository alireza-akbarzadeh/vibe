import { Skeleton } from "@/components/ui/skeleton";

export function WatchTogetherChatPlaceholder() {
    return (
        <aside className="absolute right-0 top-0 h-full w-80 bg-zinc-900/95 border-l border-zinc-800 flex flex-col z-40">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <Skeleton className="w-7 h-7 rounded-full" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="w-20 h-3 rounded" />
                            <Skeleton className="w-36 h-4 rounded" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 border-t border-zinc-800 flex gap-2 bg-zinc-900">
                <Skeleton className="flex-1 h-10 rounded-lg" />
                <Skeleton className="w-16 h-10 rounded-lg" />
            </div>
        </aside>
    );
}
