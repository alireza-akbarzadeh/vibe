import { useStore } from '@tanstack/react-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Library, ListFilter, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

import {
    type ActiveFilter,
    closeAddToPlaylist,
    createPlaylist,
    musicStore,
    setFilter,
    setSearchQuery
} from '@/domains/music/music.store';
import { AddToPlaylistModal } from '../components/add-playlist';
import { CreatePlaylistDialog } from '../components/create-playlist';
import { NavItem } from './artists/components/side-nav-item';
import { SidebarItem } from './artists/components/sidebar-item';

export function Sidebar() {
    const { library, searchQuery, activeFilter, isAddModalOpen } = useStore(musicStore);

    // UI Local States
    const [isSearching, setIsSearching] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const filteredLibrary = library.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "All" ||
            (activeFilter === "Playlists" && item.type === 'playlist') ||
            (activeFilter === "Artists" && item.type === 'artist');
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="w-72 bg-black flex flex-col h-full gap-2 p-2 select-none">
            {/* Nav Group */}
            <nav className="bg-[#121212] rounded-xl p-2 space-y-1">
                <NavItem icon={Home} label="Home" to="/music" />
                <NavItem icon={Search} label="Search" to="/music/search" />
            </nav>

            {/* Library Group */}
            <div className="bg-[#121212] rounded-xl flex-1 flex flex-col overflow-hidden">
                <header className="pt-3 px-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-10">
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <button type='button' className="flex items-center gap-3 hover:text-white transition-colors font-bold group">
                            <Library className="w-6 h-6" />
                            <span>Your Library</span>
                        </button>
                        <Plus
                            onClick={() => setIsCreateOpen(true)}
                            className="w-5 h-5 hover:text-white cursor-pointer hover:bg-white/10 rounded-full p-0.5 transition-all"
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar py-6">
                        {['All', 'Playlists', 'Artists'].map((f) => (
                            <button
                                type='button'
                                key={f}
                                onClick={() => setFilter(f as ActiveFilter)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${activeFilter === f ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Restored Library Search Bar */}
                    <div className="pb-2 flex items-center justify-between text-gray-400 min-h-10">
                        <div className="flex items-center flex-1">
                            {isSearching ? (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: '100%', opacity: 1 }}
                                    className="relative flex items-center w-full bg-[#242424] rounded-md px-2 py-1.5 mr-2"
                                >
                                    <Search className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                    <input
                                        className="bg-transparent text-xs text-white outline-none w-full placeholder:text-gray-500"
                                        placeholder="Search in Your Library"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <X
                                        className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors"
                                        onClick={() => { setIsSearching(false); setSearchQuery(""); }}
                                    />
                                </motion.div>
                            ) : (
                                <button
                                    type='button'
                                    onClick={() => setIsSearching(true)}
                                    className="p-1.5 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <Search className="w-4 h-4 hover:text-white cursor-pointer" />
                                </button>
                            )}
                        </div>

                        {!isSearching && (
                            <button type='button' className="flex items-center gap-1.5 text-xs font-medium hover:text-white transition-colors group">
                                <span>Recents</span>
                                <ListFilter className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </header>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto px-2 pt-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {filteredLibrary.map((item) => (
                            <SidebarItem key={item.id} item={item} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Global Modals */}
            <CreatePlaylistDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreatePlaylist={(data) => createPlaylist(data.name, data.description)}
            />

            <AddToPlaylistModal
                isOpen={isAddModalOpen}
                onClose={closeAddToPlaylist}
                playlists={library.filter(i => i.type === 'playlist')}
                onAddToPlaylist={(playlistId) => {
                    closeAddToPlaylist();
                }}
                onCreateNew={() => {
                    closeAddToPlaylist();
                    setIsCreateOpen(true);
                }}
            />
        </div>
    );
}