import { useNavigate } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Bookmark } from 'lucide-react';
import { generateSlug } from '@/lib/utils';
import { actions, blogStore } from '../blog.store';
import { BLOG_CATEGORIES, type FeatureArticle } from '../blog-mock';

interface ArticleCardProps {
    article: FeatureArticle
}

export function ArticleCard({ article }: ArticleCardProps) {
    const navigate = useNavigate();

    // Subscribe to bookmarks state
    const isBookmarked = useStore(blogStore, (s) => s.bookmarks.includes(article.id));
    const categoryInfo = BLOG_CATEGORIES.find(c => c.id === article.category);

    const handleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation(); // Critical: stops the card click (navigate) from firing
        actions.toggleBookmark(article.id);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => navigate({
                to: "/blog/$blogslug",
                params: { blogslug: generateSlug(article.title) }
            })}
            className="group cursor-pointer flex flex-col h-full relative"
        >
            {/* Image Container */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-neutral-900">
                <motion.img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Glassy Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Bookmark Button (Top Right) */}
                <button
                    type="button"
                    onClick={handleBookmark}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 z-20 ${isBookmarked
                            ? 'bg-purple-500 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                            : 'bg-black/40 border-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60'
                        }`}
                >
                    <Bookmark
                        size={16}
                        fill={isBookmarked ? "currentColor" : "none"}
                        className={isBookmarked ? "animate-in zoom-in duration-300" : ""}
                    />
                </button>

                {/* Category Badge (Top Left) */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                        {categoryInfo?.icon && <categoryInfo.icon size={12} className="text-purple-400" />}
                        {categoryInfo?.label}
                    </span>
                </div>

                {/* View Icon (Bottom Right) */}
                <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <div className="p-2 bg-white rounded-full text-black shadow-xl">
                        <ArrowUpRight size={20} />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1 space-y-3 px-1">
                <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                    <span className="text-neutral-400">{article.publishDate}</span>
                    <span className="w-1 h-1 bg-neutral-800 rounded-full" />
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime} min read
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
                    {article.title}
                </h3>

                <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed flex-1">
                    {article.excerpt}
                </p>

                {/* Author Footer */}
                <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                            <img
                                src={article.author.avatar}
                                alt={article.author.name}
                                className="w-full h-full rounded-full object-cover border border-white/10"
                            />
                        </div>
                        <span className="text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors">
                            {article.author.name}
                        </span>
                    </div>

                    {/* Subtle "Saved" label if bookmarked */}
                    {isBookmarked && (
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                            Saved to Library
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}