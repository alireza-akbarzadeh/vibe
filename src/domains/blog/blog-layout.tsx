import { Link } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { motion } from 'framer-motion';
import {
    Compass,
    Film, Flame, Heart,
    Music, Play,
    Search, Settings, Sparkles, User
} from 'lucide-react';
import type { ReactNode } from 'react';
import { MSG } from '@/constants/constants';
import { actions, blogStore } from '@/domains/blog/blog.store';
import { MOCK_ARTICLES } from '@/domains/blog/blog-mock';

const CATEGORIES = [
    { id: 'all', label: 'Feed', icon: Compass },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'movies', label: 'Cinema', icon: Film },
    { id: 'artists', label: 'Artists', icon: User },
    { id: 'behind', label: 'Originals', icon: Play },
];

interface BlogLayoutProps {
    children: ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
    const activeCategory = useStore(blogStore, (s) => s.activeCategory);
    const bookmarks = useStore(blogStore, (s) => s.bookmarks);
    const likes = useStore(blogStore, (s) => s.likes);
    const readingProgress = useStore(blogStore, (s) => s.readingProgress);

    const unfinishedArticles = MOCK_ARTICLES.filter(a =>
        readingProgress[a.id] > 0 && readingProgress[a.id] < 100
    ).slice(0, 2);

    return (
        <div className="flex min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
            <aside className="w-72 border-r border-white/5 flex flex-col sticky top-0 h-screen bg-[#080808]/80 backdrop-blur-2xl z-50">

                {/* --- 1. PREMIUM LOGO SECTION --- */}
                <div className="p-8">
                    <Link to="/" className="group flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-500">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">
                                {MSG.APP_NAME}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase mt-1">
                                Editorial v2
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                    {/* --- 2. QUICK SEARCH SHORTCUT --- */}
                    <button
                        onClick={() => actions.setSearchQuery('')} // Focus search logic
                        className="w-full mb-8 flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-neutral-500 hover:bg-white/[0.05] hover:text-neutral-300 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <Search size={16} />
                            <span className="text-sm font-medium">Quick search...</span>
                        </div>
                        <kbd className="text-[10px] font-bold bg-black px-1.5 py-0.5 rounded border border-white/10 group-hover:border-white/20 transition-colors">
                            ⌘K
                        </kbd>
                    </button>

                    {/* --- 3. MAIN NAVIGATION --- */}
                    <div className="mb-8">
                        <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-4">
                            Discover
                        </h2>
                        <nav className="space-y-1">
                            {CATEGORIES.map((cat) => {
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => actions.setActiveCategory(cat.id)}
                                        className={`w-full group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative ${isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-200'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-2xl"
                                            />
                                        )}
                                        <cat.icon size={18} className={`relative z-10 ${isActive ? 'text-purple-400' : 'group-hover:text-neutral-300'}`} />
                                        <span className="text-sm font-bold relative z-10">{cat.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* --- 4. LIBRARY & STATS --- */}
                    <div className="mb-8">
                        <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-4">
                            Collection
                        </h2>
                        <div className="space-y-1">
                            <LibraryButton
                                icon={Heart}
                                label="Liked"
                                count={likes.length}
                                color="text-pink-500"
                                active={activeCategory === 'likes'}
                                onClick={() => actions.setActiveCategory('likes')}
                            />
                            <LibraryButton
                                icon={Sparkles}
                                label="Saved"
                                count={bookmarks.length}
                                color="text-yellow-400"
                                active={activeCategory === 'bookmarks'}
                                onClick={() => actions.setActiveCategory('bookmarks')}
                            />
                        </div>
                    </div>

                    {/* --- 5. READING GOALS (New Feature) --- */}
                    <div className="mb-8 p-4 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-3">
                            <Flame size={14} className="text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Daily Streak</span>
                        </div>
                        <div className="flex gap-1.5 mb-3">
                            {[1, 1, 1, 1, 0, 0, 0].map((active, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${active ? 'bg-orange-500' : 'bg-white/10'}`} />
                            ))}
                        </div>
                        <p className="text-[10px] text-neutral-400 font-medium">4 days streak! Keep it up.</p>
                    </div>

                    {/* --- 6. CONTINUE READING --- */}
                    {unfinishedArticles.length > 0 && (
                        <div className="mb-8">
                            <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-4">
                                Resume
                            </h2>
                            <div className="space-y-4">
                                {unfinishedArticles.map(article => (
                                    <div key={article.id} className="group cursor-pointer px-4">
                                        <p className="text-xs font-bold text-neutral-400 group-hover:text-purple-400 transition-colors truncate">
                                            {article.title}
                                        </p>
                                        <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${readingProgress[article.id]}%` }}
                                                className="h-full bg-purple-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- 7. USER PROFILE FOOTER --- */}
                <div className="p-4 mt-auto border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <img
                            src="https://i.pravatar.cc/100?u=me"
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5 group-hover:ring-purple-500/50 transition-all"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Alex Rivera</p>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Pro Member</p>
                        </div>
                        <Settings size={16} className="text-neutral-600 hover:text-white transition-colors" />
                    </div>
                </div>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent">
                {children}
            </main>
        </div>
    );
}

// Sub-component for Library Buttons to keep code clean
function LibraryButton({ icon: Icon, label, count, color, active, onClick }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${active ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className={count > 0 ? color : ""} fill={active && count > 0 ? "currentColor" : "none"} />
                <span className="text-sm font-semibold">{label}</span>
            </div>
            {count > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white/20' : 'bg-white/5'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}