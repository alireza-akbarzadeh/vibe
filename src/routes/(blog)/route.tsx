import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { Film, LayoutGrid, Music, Play, Sparkles, User } from 'lucide-react';
import { actions, blogStore } from '@/domains/blog/blog.store';

export const Route = createFileRoute('/(blog)')({
    component: BlogLayout,
});

const CATEGORIES = [
    { id: 'all', label: 'All Stories', icon: LayoutGrid },
    { id: 'music', label: 'Music Stories', icon: Music },
    { id: 'movies', label: 'Movie Reviews', icon: Film },
    { id: 'artists', label: 'Artist Spotlights', icon: User },
    { id: 'behind', label: 'Behind the Scenes', icon: Play },
];

function BlogLayout() {
    const activeCategory = useStore(blogStore, (s) => s.activeCategory);
    const bookmarks = useStore(blogStore, (s) => s.bookmarks);

    return (
        <div className="flex min-h-screen bg-[#050505] text-white">
            <aside className="w-72 border-r border-white/5 flex flex-col sticky top-0 h-screen bg-black/50 backdrop-blur-xl">
                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Editorial Section */}
                    <div className="mb-8">
                        <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-4">
                            Editorial
                        </h2>
                        <nav className="space-y-1">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => actions.setActiveCategory(cat.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeCategory === cat.id ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
                                        }`}
                                >
                                    <cat.icon size={18} className={activeCategory === cat.id ? 'text-purple-400' : ''} />
                                    <span className="text-sm font-semibold">{cat.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Library Section */}
                    <div>
                        <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-4">
                            Library
                        </h2>
                        <button
                            onClick={() => actions.setActiveCategory('bookmarks')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeCategory === 'bookmarks' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
                                }`}
                        >
                            <Sparkles size={18} className={bookmarks.length > 0 ? "text-yellow-400" : ""} />
                            <span className="text-sm font-semibold">Saved Stories</span>
                            {bookmarks.length > 0 && (
                                <span className="ml-auto text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold">
                                    {bookmarks.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                {/* ... Promo Widget */}
            </aside>
            <main className="flex-1 overflow-y-auto"><Outlet /></main>
        </div>
    );
}