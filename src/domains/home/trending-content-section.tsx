/** biome-ignore-all lint/suspicious/noArrayIndexKey: index keys fine for static lists */

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Flame,
    Play,
    Sparkles,
    Star,
    Trophy,
} from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Typography } from "@/components/ui/typography";
import { useLazySection } from "@/hooks/useLazySection";
import type { MediaList } from "@/orpc/models/media.schema";
import {
    latestReleasesQueryOptions,
    topRatedQueryOptions,
    trendingQueryOptions,
} from "./home.queries";

// ─── Content Card ──────────────────────────────────────────────
function ContentCard({
    item,
    index,
    variant = "poster",
}: {
    item: MediaList;
    index: number;
    variant?: "poster" | "landscape";
}) {
    const isPoster = variant === "poster";

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.5 }}
            className={`shrink-0 snap-start group cursor-pointer ${isPoster ? "w-48 md:w-52" : "w-72 md:w-80"}`}
        >
            <Link to="/movies/$movieId" params={{ movieId: item.id }}>
                <div
                    className={`relative ${isPoster ? "aspect-2/3" : "aspect-video"} rounded-2xl overflow-hidden mb-3`}
                >
                    <Image
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Play button on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-2xl"
                        >
                            <Play className="w-7 h-7 fill-current ml-0.5" />
                        </motion.div>
                    </div>

                    {/* Rating badge */}
                    {item.rating && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs font-bold">
                                {item.rating.toFixed(1)}
                            </span>
                        </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/20 uppercase tracking-wider">
                            {item.type === "TRACK" ? "Music" : item.type === "EPISODE" ? "Series" : "Movie"}
                        </span>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        {!isPoster && (
                            <h3 className="text-white font-bold text-base truncate mb-1">
                                {item.title}
                            </h3>
                        )}
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                            <span>{item.releaseYear}</span>
                            {item.duration > 0 && (
                                <>
                                    <span className="text-gray-600">·</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {item.duration >= 60
                                            ? `${Math.floor(item.duration / 60)}h ${item.duration % 60}m`
                                            : `${item.duration}m`}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Title below poster */}
                {isPoster && (
                    <>
                        <h3 className="text-white font-semibold text-sm truncate mb-1 group-hover:text-cyan-400 transition-colors">
                            {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <span>{item.releaseYear}</span>
                            {item.genres.length > 0 && (
                                <>
                                    <span>·</span>
                                    <span>{item.genres[0].genre.name}</span>
                                </>
                            )}
                        </div>
                    </>
                )}
            </Link>
        </motion.div>
    );
}

// ─── Scrollable Row ────────────────────────────────────────────
function ContentRow({
    title,
    subtitle,
    icon: Icon,
    iconColor,
    items,
    variant = "poster",
}: {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    items: MediaList[];
    variant?: "poster" | "landscape";
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -400 : 400,
                behavior: "smooth",
            });
        }
    };

    if (items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="mb-16 last:mb-0"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-xl bg-linear-to-br ${iconColor} shadow-lg`}
                    >
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <Typography.H2 className="text-2xl md:text-3xl font-bold text-white">
                            {title}
                        </Typography.H2>
                        <Typography.P className="text-gray-500 text-sm mt-0.5">
                            {subtitle}
                        </Typography.P>
                    </div>
                </div>
                <div className="hidden md:flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => scroll("left")}
                        className="rounded-full bg-white/5 hover:bg-white/10 text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => scroll("right")}
                        className="rounded-full bg-white/5 hover:bg-white/10 text-white"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Scrollable content */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {items.map((item, index) => (
                    <ContentCard
                        key={item.id}
                        item={item}
                        index={index}
                        variant={variant}
                    />
                ))}
            </div>
        </motion.div>
    );
}

// ─── Main Section ──────────────────────────────────────────────
export default function TrendingContentSection() {
    const { ref: sectionRef, isVisible } = useLazySection("400px");
    const { data: trendingData } = useQuery(trendingQueryOptions(15, isVisible));
    const { data: topRatedData } = useQuery(topRatedQueryOptions(15, isVisible));
    const { data: latestData } = useQuery(latestReleasesQueryOptions(15, isVisible));

    const trendingItems = trendingData?.data?.items ?? [];
    const topRatedItems = topRatedData?.data?.items ?? [];
    const latestItems = latestData?.data?.items ?? [];

    const hasContent =
        trendingItems.length > 0 ||
        topRatedItems.length > 0 ||
        latestItems.length > 0;

    if (!hasContent) return <div ref={sectionRef} />;

    return (
        <section ref={sectionRef} className="relative py-28 bg-linear-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] overflow-hidden">
            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 w-1/2 h-96 bg-purple-600/6 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-1/2 h-96 bg-cyan-600/6 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300 font-medium">
                            Curated For You
                        </span>
                    </motion.div>
                    <Typography.H2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Discover What's{" "}
                        <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Trending
                        </span>
                    </Typography.H2>
                    <Typography.P className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Real content from our library, updated daily
                    </Typography.P>
                </motion.div>

                {/* Content Rows */}
                <ContentRow
                    title="Trending Now"
                    subtitle="What everyone's watching this week"
                    icon={Flame}
                    iconColor="from-orange-500 to-red-600"
                    items={trendingItems}
                    variant="poster"
                />

                <ContentRow
                    title="Top Rated"
                    subtitle="Highest rated by our community"
                    icon={Trophy}
                    iconColor="from-yellow-500 to-orange-600"
                    items={topRatedItems}
                    variant="landscape"
                />

                <ContentRow
                    title="Just Released"
                    subtitle="Fresh content added this week"
                    icon={Sparkles}
                    iconColor="from-cyan-500 to-blue-600"
                    items={latestItems}
                    variant="poster"
                />
            </div>
        </section>
    );
}
