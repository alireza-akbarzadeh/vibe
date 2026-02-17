import { createFileRoute } from "@tanstack/react-router";
import { History, Loader2, Play, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { MotionPage } from "@/components/motion/motion-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import {
  useClearHistory,
  useDeleteHistoryItem,
  useProfiles,
  useViewingHistory,
} from "@/hooks/useLibrary";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(library)/library/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Get user's default profile for viewing history
  const { data: profilesData } = useProfiles();
  const defaultProfile = profilesData?.data?.[0];

  const { data: historyData, isLoading } = useViewingHistory(
    defaultProfile?.id ?? "",
    { page, limit: 30 },
  );
  const clearHistory = useClearHistory();
  const deleteItem = useDeleteHistoryItem();

  const items = historyData?.data?.items ?? [];
  const pagination = historyData?.data?.pagination;

  const filteredItems = searchQuery
    ? items.filter((item) =>
      item.media?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
    )
    : items;

  const handleClearAll = () => {
    if (!defaultProfile?.id) return;
    if (confirm("Permanently wipe all playback history?")) {
      clearHistory.mutate({ profileId: defaultProfile.id });
    }
  };

  const handleRemoveItem = (id: string) => {
    deleteItem.mutate({ id });
  };

  return (
    <MotionPage className="min-h-screen p-6 md:p-16">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <History size={20} />
            <Typography.S className="font-black uppercase tracking-[0.4em] text-[10px]">
              Registry Logs
            </Typography.S>
          </div>
          <Typography.H1 className="text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] italic">
            Playback{" "}
            <span className="text-muted-foreground/20 not-italic">
              History
            </span>
          </Typography.H1>
          {pagination && (
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              {pagination.total} entr
              {pagination.total !== 1 ? "ies" : "y"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
            <Input
              placeholder="SEARCH LOGS..."
              className="bg-zinc-900/40 border-white/5 pl-11 rounded-full text-[10px] font-black uppercase tracking-widest focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={handleClearAll}
            variant="destructive"
            size="icon"
            disabled={
              clearHistory.isPending || items.length === 0
            }
            className="rounded-full size-12 shrink-0 bg-zinc-900 hover:bg-red-600/20 text-red-500 border border-white/5"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </header>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <div className="space-y-12">
          {filteredItems.length > 0 ? (
            <div className="grid gap-2">
              <TimeDivider label="Viewing History" />
              {filteredItems.map((item) => (
                <HistoryItem
                  key={item.id}
                  type={item.media?.type ?? "MOVIE"}
                  title={item.media?.title ?? "Unknown"}
                  image={item.media?.thumbnail ?? ""}
                  progress={item.progress}
                  completed={item.completed}
                  viewedAt={item.viewedAt}
                  onRemove={() =>
                    handleRemoveItem(item.id)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-white/5 rounded-[3rem]">
              <History className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
              <Typography.P className="text-muted-foreground/40 font-black uppercase tracking-[0.4em] text-xs">
                No entries found in playback history
              </Typography.P>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex items-center justify-center gap-4 pt-12">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full font-black uppercase tracking-widest text-[9px]"
          >
            Previous
          </Button>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Page {page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={
              page >=
              Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full font-black uppercase tracking-widest text-[9px]"
          >
            Next
          </Button>
        </div>
      )}
    </MotionPage>
  );
}

function TimeDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6 mb-4">
      <Typography.S className="font-black uppercase tracking-[0.5em] text-xs text-primary whitespace-nowrap">
        {label}
      </Typography.S>
      <div className="h-px w-full bg-white/5" />
    </div>
  );
}

function HistoryItem({
  type,
  title,
  image,
  progress,
  completed,
  viewedAt,
  onRemove,
}: {
  type: string;
  title: string;
  image: string;
  progress: number;
  completed: boolean;
  viewedAt: string;
  onRemove: () => void;
}) {
  return (
    <div className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-zinc-900/40 transition-all border border-transparent hover:border-white/5">
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-zinc-900 cursor-pointer",
          type === "MOVIE" || type === "EPISODE"
            ? "aspect-video w-32 md:w-40 rounded-xl"
            : "size-16 md:size-20 rounded-lg",
        )}
      >
        <img
          src={image || "/api/placeholder/400/300"}
          alt={title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <Play size={24} fill="white" className="text-white" />
        </div>
        {!completed && progress > 0 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <div
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {completed && (
          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500/80 backdrop-blur-sm">
            <span className="text-[8px] font-black uppercase tracking-widest text-white">
              Done
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Typography.S className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
            {type}
          </Typography.S>
          <div className="size-1 rounded-full bg-muted-foreground/20" />
          <Typography.S className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
            {new Date(viewedAt).toLocaleDateString()}
          </Typography.S>
        </div>
        <Typography.H4 className="text-sm md:text-base font-bold truncate group-hover:text-primary transition-colors">
          {title}
        </Typography.H4>
        {!completed && progress > 0 && (
          <Typography.P className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest mt-1">
            {progress}% completed
          </Typography.P>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}