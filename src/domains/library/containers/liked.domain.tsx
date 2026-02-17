import { AnimatePresence, motion } from "framer-motion";
import { Heart, Loader2, Play, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { MotionPage } from "@/components/motion/motion-page";
import { Button } from "@/components/ui/button";
import { useFavorites, useToggleFavorite } from "@/hooks/useLibrary";
import { cn } from "@/lib/utils";

export const LikedLibraryDomain = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const { data: favoritesData, isLoading } = useFavorites({ page, limit: 30 });
    const toggleFavorite = useToggleFavorite();

    const items = favoritesData?.data?.items ?? [];
    const pagination = favoritesData?.data?.pagination;

    const filteredItems = searchQuery
        ? items.filter((item) =>
            item.media?.title
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()),
        )
        : items;

    const handleRemoveFavorite = (mediaId: string) => {
        toggleFavorite.mutate({ mediaId });
    };

    return (
        <MotionPage className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Heart className="size-6 fill-current" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-[0.2em]">
                            Your Collection
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        Liked{" "}
                        <span className="text-muted-foreground/20">
                            Content
                        </span>
                    </h1>
                    {pagination && (
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            {pagination.total} item
                            {pagination.total !== 1 && "s"}
                        </p>
                    )}
                </div>

                {/* Search */}
                <div className="relative group w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search your likes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    />
                </div>
            </header>

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {/* Grid */}
            {!isLoading && (
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
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

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFavorite(
                                                    item.mediaId,
                                                );
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
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
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
                <div className="flex items-center justify-center gap-4 pt-8">
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
            {!isLoading && filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="p-6 rounded-full bg-white/5 border border-dashed border-white/10">
                        <Heart className="size-12 text-muted-foreground/10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-foreground font-bold text-xl">
                            No likes found
                        </h3>
                        <p className="text-muted-foreground/40 text-sm">
                            Start exploring and tap the heart icon to save
                            items.
                        </p>
                    </div>
                </div>
            )}
        </MotionPage>
    );
};