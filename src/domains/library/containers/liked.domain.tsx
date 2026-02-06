import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Heart, Mic2, Music, Search, Video } from "lucide-react";
import { useState } from "react";
import { MotionPage } from "@/components/motion/motion-page";
import { MediaCard } from "@/domains/library/components/media-card";
import { useLibraryStore } from "@/domains/library/store/library-store";
import { cn } from "@/lib/utils";
import { mockBlogs, mockPodcasts, mockTracks, mockVideos } from "../library-mock-data";

// Define the tabs for the UI
const TABS = [
    { id: "all", label: "All", icon: Heart },
    { id: "tracks", label: "Music", icon: Music },
    { id: "videos", label: "Videos", icon: Video },
    { id: "podcasts", label: "Podcasts", icon: Mic2 },
    { id: "blogs", label: "Articles", icon: BookOpen },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const LikedLibraryDomain = () => {
    const [activeTab, setActiveTab] = useState<TabId>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Get liked IDs from TanStack Store
    const likedIds = useLibraryStore((state) => state.likes);

    // Map IDs to actual Data Objects
    const likedData = {
        tracks: mockTracks.filter((t) => likedIds.tracks.includes(t.id)),
        videos: mockVideos.filter((v) => likedIds.videos.includes(v.id.toString())), // Handling string/number mismatch
        blogs: mockBlogs.filter((b) => likedIds.blogs.includes(b.id)),
        podcasts: mockPodcasts.filter((p) => likedIds.podcasts.includes(p.id)),
    };

    // Flatten for "All" tab or filter by active tab
    const getFilteredDisplay = () => {
        if (activeTab === "all") {
            return [
                ...likedData.tracks.map(item => ({ ...item, type: 'track' as const })),
                ...likedData.videos.map(item => ({ ...item, type: 'video' as const })),
                ...likedData.podcasts.map(item => ({ ...item, type: 'podcast' as const })),
                ...likedData.blogs.map(item => ({ ...item, type: 'blog' as const })),
            ];
        }
        return likedData[activeTab].map(item => ({ ...item, type: activeTab.slice(0, -1) as any }));
    };

    const displayItems = getFilteredDisplay().filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MotionPage className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Heart className="size-6 fill-current" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-[0.2em]">Your Collection</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Liked <span className="text-white/20">Content</span>
                    </h1>
                </div>

                {/* Search Bar */}
                <div className="relative group w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search your likes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    />
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-white/3 p-1 rounded-2xl border border-white/5 w-fit">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                                isActive
                                    ? "bg-primary text-black shadow-lg shadow-primary/20"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="size-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            {/* Content Grid */}
            <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {displayItems.map((item) => (
                        <motion.div
                            key={`${item.type}-${item.id}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MediaCard
                                id={item.id.toString()}
                                title={item.title}
                                subtitle={'artist' in item ? item.artist : 'channel' in item ? item.channel : item.author}
                                image={'cover' in item ? item.cover : item.poster_path}
                                type={item.type}
                                meta={'genre' in item ? item.genre : 'category' in item ? item.category : undefined}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {displayItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="p-6 rounded-full bg-white/5 border border-dashed border-white/10">
                        <Heart className="size-12 text-white/10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-white font-bold text-xl">No likes found</h3>
                        <p className="text-white/40 text-sm">Start exploring and tap the heart icon to save items.</p>
                    </div>
                </div>
            )}
        </MotionPage>
    );
};