import { useStore } from '@tanstack/react-store';
import { motion } from "framer-motion"
import { Search, XCircle } from 'lucide-react';
import { actions, blogStore } from './blog.store';
import { MOCK_ARTICLES } from './blog-mock';
import { ArticleCard } from './components/article-cart';

// ... other imports

export default function Blog() {
    const activeCategory = useStore(blogStore, (s) => s.activeCategory);
    const searchQuery = useStore(blogStore, (s) => s.searchQuery);

    // Filter Logic: Category + Search
    const bookmarks = useStore(blogStore, (s) => s.bookmarks);

    const filteredArticles = MOCK_ARTICLES.filter((article) => {
        // New Bookmark View Logic
        if (activeCategory === 'bookmarks') {
            return bookmarks.includes(article.id) &&
                (article.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-12 pb-20">
            {/* Search Section */}
            <header className="px-8 pt-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white">
                        {searchQuery ? `Results for "${searchQuery}"` : 'Editorial'}
                    </h1>
                </div>

                <div className="relative group">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-purple-400' : 'text-gray-500'}`} size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => actions.setSearchQuery(e.target.value)}
                        placeholder="Search articles..."
                        className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 w-full md:w-80 outline-none focus:border-purple-500/50 transition-all"
                    />
                    {searchQuery && (
                        <button
                            type='button'
                            onClick={() => actions.setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            <XCircle size={16} />
                        </button>
                    )}
                </div>
            </header>

            {/* Articles Grid */}
            <section className="px-8">
                {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    /* --- PHENOMENAL EMPTY STATE --- */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Search className="text-gray-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No stories found</h2>
                        <p className="text-gray-500 max-w-xs">
                            We couldn't find anything matching "{searchQuery}". Try a different keyword.
                        </p>
                        <button
                            type='button'
                            onClick={() => actions.setSearchQuery('')}
                            className="mt-6 text-purple-400 font-bold hover:text-purple-300 transition-colors"
                        >
                            Clear search
                        </button>
                    </motion.div>
                )}
            </section>
        </div>
    );
}