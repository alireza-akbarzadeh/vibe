import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Loader2, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { MotionPage } from "@/components/motion/motion-page";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useToggleWatchList, useWatchList } from "@/hooks/useLibrary";

export const Route = createFileRoute("/(library)/library/saved")({
  component: SavedPage,
});

function SavedPage() {
  const [page, setPage] = useState(1);
  const { data: watchlistData, isLoading } = useWatchList({ page, limit: 24 });
  const toggleWatchList = useToggleWatchList();

  const items = watchlistData?.data?.items ?? [];
  const pagination = watchlistData?.data?.pagination;

  const handleRemove = (mediaId: string) => {
    toggleWatchList.mutate({ mediaId });
  };

  return (
    <MotionPage className="min-h-screen p-6 md:p-16">
      {/* Header */}
      <header className="flex flex-col gap-4 mb-16">
        <div className="flex items-center gap-3 text-primary">
          <Bookmark size={24} fill="currentColor" />
          <Typography.S className="font-black uppercase tracking-[0.3em] text-xs">
            Library Registry
          </Typography.S>
        </div>
        <Typography.H1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8]">
          Saved{" "}
          <span className="text-muted-foreground/20 text-6xl md:text-8xl not-italic">
            Items
          </span>
        </Typography.H1>
        {pagination && (
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-4">
            {pagination.total} item
            {pagination.total !== 1 && "s"} in your watchlist
          </p>
        )}
      </header>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Grid */}
      {!isLoading && items.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-zinc-900">
                  <div className="relative aspect-[2/3]">
                    <img
                      src={
                        item.media?.thumbnail ||
                        "/api/placeholder/400/600"
                      }
                      alt={item.media?.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl">
                        <Play
                          className="w-6 h-6"
                          fill="currentColor"
                        />
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/80">
                        {item.media?.type ?? "MEDIA"}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.mediaId);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 px-1 space-y-0.5">
                  <p className="font-black text-[13px] tracking-tight truncate leading-tight text-foreground">
                    {item.media?.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Added{" "}
                    {new Date(
                      item.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
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

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="p-6 rounded-full bg-white/5 border border-dashed border-white/10">
            <Bookmark className="size-12 text-muted-foreground/10" />
          </div>
          <div className="text-center">
            <h3 className="text-foreground font-bold text-xl">
              Your watchlist is empty
            </h3>
            <p className="text-muted-foreground/40 text-sm">
              Save items to watch later by tapping the bookmark
              icon.
            </p>
          </div>
        </div>
      )}
    </MotionPage>
  );
}