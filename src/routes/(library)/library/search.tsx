import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Film, Headphones, Loader2, Music, Play, Search, X } from "lucide-react";
import { useState } from "react";
import {
  fadeInUp,
  MotionPage,
  staggerContainer,
} from "@/components/motion/motion-page.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useSearchContent } from "@/hooks/useLibrary";

export const Route = createFileRoute("/(library)/library/search")({
  component: SearchPage,
});

const TYPE_FILTERS = [
  { label: "All", value: undefined, icon: Search },
  { label: "Movies", value: "MOVIE" as const, icon: Film },
  { label: "Episodes", value: "EPISODE" as const, icon: Headphones },
  { label: "Tracks", value: "TRACK" as const, icon: Music },
];

function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<
    "MOVIE" | "EPISODE" | "TRACK" | undefined
  >(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useSearchContent({
    query,
    type: activeType,
    limit: 20,
    page,
  });

  const items = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <MotionPage>
      {/* Search Header */}
      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Search
        </h1>

        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search movies, episodes, tracks..."
            className="pl-12 pr-12 h-14 text-lg rounded-2xl bg-card border-border/50 focus:border-primary"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 mt-6 flex-wrap">
          {TYPE_FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeType === filter.value;
            return (
              <Button
                key={filter.label}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="gap-2 rounded-full"
                onClick={() => {
                  setActiveType(filter.value);
                  setPage(1);
                }}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </motion.section>

      {/* Loading */}
      {(isLoading || isFetching) && query.length > 0 && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Results Count */}
      {query.length > 0 && !isLoading && (
        <p className="text-sm text-muted-foreground mb-6">
          {total} result{total !== 1 ? "s" : ""} for "{query}"
        </p>
      )}

      {/* Results Grid */}
      {!isLoading && items.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8"
        >
          {items.map((item: any) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900">
                <img
                  src={
                    item.thumbnail ||
                    "/api/placeholder/400/600"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl">
                    <Play
                      className="w-6 h-6"
                      fill="currentColor"
                    />
                  </div>
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/80">
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="mt-3 px-1">
                <p className="font-bold text-sm tracking-tight truncate text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                {item.collection && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {item.collection.title}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Empty States */}
      {query.length === 0 && (
        <div className="py-20 text-center">
          <Search className="w-16 h-16 text-muted-foreground/10 mx-auto mb-4" />
          <p className="text-xl font-medium text-muted-foreground mb-2">
            Discover something new
          </p>
          <p className="text-sm text-muted-foreground/70">
            Search across our entire catalog of movies, episodes,
            and tracks.
          </p>
        </div>
      )}

      {query.length > 0 && !isLoading && items.length === 0 && (
        <div className="py-20 text-center">
          <Search className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium italic">
            No results found for "{query}". Try a different search
            term.
          </p>
        </div>
      )}
    </MotionPage>
  );
}
