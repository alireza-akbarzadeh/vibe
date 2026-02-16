import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useLazySection } from "@/hooks/useLazySection";
import type { MediaList } from "@/orpc/models/media.schema";
import type { MovieVariantCard } from "./movie-carousel";
import { MovieCarousel } from "./movie-carousel";

interface LazyMovieCarouselProps {
    title: string;
    subtitle?: string;
    variant: MovieVariantCard;
    showProgress?: boolean;
    queryKey: unknown[];
    queryFn: () => Promise<{ data: { items: MediaList[] } }>;
    sectionSlug?: string; // Optional explore page section slug
}

/**
 * Lazy-loading wrapper for MovieCarousel
 * Only fetches data when section comes into viewport (300px threshold)
 * Optimized for performance on high-traffic pages
 */
export function LazyMovieCarousel({
    title,
    subtitle,
    variant,
    showProgress,
    queryKey,
    queryFn,
    sectionSlug,
}: LazyMovieCarouselProps) {
    const { ref, data, isVisible } = useLazySection<{
        data: { items: MediaList[] };
    }>(
        {
            queryKey,
            queryFn,
            staleTime: 5 * 60 * 1000, // Cache for 5 minutes
            gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
        },
        "300px", // Start loading 300px before viewport
    );

    const movies = data?.data?.items ?? [];
    const isLoading = !data && isVisible;

    // Don't render anything if not visible yet (saves DOM nodes)
    if (!isVisible) {
        return (
            <section
                ref={ref}
                className="relative max-w-450 mx-auto px-6 h-100"
                aria-busy="true"
            />
        );
    }

    // Show loading state
    if (isLoading) {
        return (
            <section
                ref={ref}
                className="relative max-w-450 mx-auto px-6 h-100 flex items-center justify-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-3"
                >
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <p className="text-sm text-gray-400">Loading {title}...</p>
                </motion.div>
            </section>
        );
    }

    // Don't show empty sections
    if (movies.length === 0) {
        return null;
    }

    return (
        <section ref={ref}>
            <MovieCarousel
                title={title}
                subtitle={subtitle}
                movies={movies}
                variant={variant}
                showProgress={showProgress}
                sectionSlug={sectionSlug}
            />
        </section>);
}