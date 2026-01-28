import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import type { Song } from '../music.store';

export function NowPlaying({ song, isPlaying }: { isPlaying: boolean; song: Song }) {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="flex flex-col items-center lg:items-start">
            <motion.div
                animate={{
                    scale: isPlaying ? [1, 1.02, 1] : 1,
                }}
                transition={{
                    duration: 2,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut",
                }}
                className="relative group"
            >
                {/* Main artwork */}
                <div className="relative w-75 h-75 md:w-100 md:h-100 lg:w-125 lg:h-125 rounded-3xl overflow-hidden shadow-2xl">
                    <img
                        src={song.albumArt}
                        alt={song.album}
                        className="w-full h-full object-cover"
                    />

                    {/* Animated overlay when playing */}
                    <AnimatePresence>
                        {isPlaying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"
                            />
                        )}
                    </AnimatePresence>

                    {/* Vinyl effect when playing */}
                    {isPlaying && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-sm border-2 border-white/20"
                        >
                            <div className="absolute inset-2 rounded-full border-2 border-white/40" />
                            <div className="absolute inset-4 rounded-full bg-black/40" />
                        </motion.div>
                    )}
                </div>

                {/* Glow effect */}
                <motion.div
                    animate={{
                        opacity: isPlaying ? [0.4, 0.6, 0.4] : 0.3,
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -inset-4 bg-linear-to-br from-purple-600/40 to-pink-600/40 rounded-3xl blur-2xl -z-10"
                />
            </motion.div>

            {/* Song info (desktop) */}
            <div className="hidden lg:block mt-8 w-full max-w-125">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl xl:text-5xl font-bold text-white mb-3 truncate"
                        >
                            {song.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl text-gray-400 truncate"
                        >
                            {song.artist}
                        </motion.p>
                    </div>

                    {/* Like button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsLiked(!isLiked)}
                        className="ml-4 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <Heart
                            className={`w-7 h-7 transition-colors ${isLiked
                                ? 'fill-purple-500 text-purple-500'
                                : 'text-gray-400'
                                }`}
                        />
                    </motion.button>
                </div>

                {/* Album name */}
                <p className="text-gray-500 text-lg">
                    From <span className="text-gray-400">{song.album}</span>
                </p>
            </div>
        </div>
    );
}