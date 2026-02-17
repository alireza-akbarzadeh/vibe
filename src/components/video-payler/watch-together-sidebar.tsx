import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Users } from "lucide-react";
import { WatchTogetherChat } from "./watch-together-chat";

export function WatchTogetherSidebar({ sessionId }: { sessionId: string }) {
    const [open, setOpen] = React.useState(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold shadow"
                    aria-label="Open Watch Together Sidebar"
                >
                    <Users className="w-5 h-5" />
                    <span className="hidden md:inline">Watch Together</span>
                </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800">
                <SheetHeader className="p-4 border-b border-zinc-800">
                    <SheetTitle>Watch Together</SheetTitle>
                </SheetHeader>
                <div className="h-full">
                    <WatchTogetherChat sessionId={sessionId} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
