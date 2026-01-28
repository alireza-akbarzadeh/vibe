import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Film, Headphones, Music, Play, Sparkles, User } from 'lucide-react';
import { useState } from 'react';
import { generateSlug } from '@/lib/utils';

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState('all');
    const navigate = useNavigate()
    const categories = [
        { id: 'all', label: 'All Stories', icon: Sparkles },
        { id: 'music', label: 'Music Stories', icon: Music },
        { id: 'movies', label: 'Movie Reviews', icon: Film },
        { id: 'artists', label: 'Artist Spotlights', icon: User },
        { id: 'behind', label: 'Behind the Scenes', icon: Play },
        { id: 'playlists', label: 'Playlists & Soundtracks', icon: Headphones },
    ];

    const featuredArticle = {
        id: 1,
        title: "The Evolution of Sound: How Electronic Music Shaped Modern Cinema",
        excerpt: "From Vangelis to Hans Zimmer, explore the profound relationship between electronic soundscapes and visual storytelling.",
        category: 'music',
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
        author: {
            name: "Elena Rodriguez",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
            role: "Music Curator"
        },
        readTime: 8,
        publishDate: "Jan 25, 2026"
    };

    const articles = [
        {
            id: 2,
            title: "Midnight Jazz: A Playlist for the Late Hours",
            excerpt: "Dive into the smoky, intimate world of after-hours jazz with our carefully curated selection.",
            category: 'playlists',
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
            author: { name: "Marcus Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
            readTime: 5,
            publishDate: "Jan 24, 2026"
        },
        {
            id: 3,
            title: "Behind the Camera with Sofia Coppola",
            excerpt: "An intimate conversation about music, mood, and the art of cinematic storytelling.",
            category: 'behind',
            image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
            author: { name: "James Park", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
            readTime: 12,
            publishDate: "Jan 23, 2026"
        },
        {
            id: 4,
            title: "The Weeknd's Cinematic Universe",
            excerpt: "How one artist transformed music videos into visual masterpieces that blur the line between song and story.",
            category: 'artists',
            image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
            author: { name: "Elena Rodriguez", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
            readTime: 10,
            publishDate: "Jan 22, 2026"
        },
        {
            id: 5,
            title: "Blade Runner 2049: Deconstructing Zimmer's Score",
            excerpt: "A deep dive into the sonic architecture that brought a dystopian future to life.",
            category: 'movies',
            image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
            author: { name: "Marcus Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
            readTime: 15,
            publishDate: "Jan 21, 2026"
        },
        {
            id: 6,
            title: "Lo-Fi Beats and the Art of Focus",
            excerpt: "Why millions choose ambient soundscapes as their creative companion.",
            category: 'music',
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
            author: { name: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
            readTime: 6,
            publishDate: "Jan 20, 2026"
        },
        {
            id: 7,
            title: "Nolan's Tenet: When Music Moves Backward",
            excerpt: "Ludwig Göransson's reversed composition techniques explained.",
            category: 'movies',
            image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
            author: { name: "James Park", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
            readTime: 11,
            publishDate: "Jan 19, 2026"
        },
        {
            id: 8,
            title: "Billie Eilish: The Voice of a Generation",
            excerpt: "From bedroom recordings to Oscar-winning soundtracks, tracing an extraordinary journey.",
            category: 'artists',
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
            author: { name: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
            readTime: 9,
            publishDate: "Jan 18, 2026"
        },
        {
            id: 9,
            title: "Synthwave Dreams: 80s Revival Playlist",
            excerpt: "Neon lights, retro vibes, and the nostalgic pulse of synthesized perfection.",
            category: 'playlists',
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
            author: { name: "Marcus Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
            readTime: 4,
            publishDate: "Jan 17, 2026"
        },
    ];

    const filteredArticles = activeCategory === 'all'
        ? articles
        : articles.filter(a => a.category === activeCategory);

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Featured Article */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-[90vh] overflow-hidden"
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black z-10" />
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2 }}
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="relative z-20 h-full flex items-end pb-20">
                    <div className="max-w-7xl mx-auto px-6 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-3xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm text-white border border-white/20">
                                    Featured Story
                                </span>
                                <span className="text-gray-400 text-sm">{featuredArticle.publishDate}</span>
                            </div>

                            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                {featuredArticle.title}
                            </h1>

                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                {featuredArticle.excerpt}
                            </p>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={featuredArticle.author.avatar}
                                        alt={featuredArticle.author.name}
                                        className="w-12 h-12 rounded-full border-2 border-white/20"
                                    />
                                    <div>
                                        <div className="text-white font-medium">{featuredArticle.author.name}</div>
                                        <div className="text-sm text-gray-400">{featuredArticle.author.role}</div>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-white/20" />
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">{featuredArticle.readTime} min read</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ x: 4 }}
                                className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all"
                            >
                                Read Story
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Categories */}
            <section className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileHover={{ y: -2 }}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${activeCategory === category.id
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <category.icon className="w-4 h-4" />
                                <span className="font-medium">{category.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredArticles.map((article, index) => (
                        <motion.article
                            key={article.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-gray-900">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.6 }}
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white border border-white/30">
                                        {categories.find(c => c.id === article.category)?.label}
                                    </span>
                                </div>

                                {/* Read More on Hover */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    onClick={() => navigate({ to: "/blog/$blogslug", params: { blogslug: generateSlug(featuredArticle.title) } })}

                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-black" />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed line-clamp-2">
                                    {article.excerpt}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={article.author.avatar}
                                            alt={article.author.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="text-sm text-gray-400">{article.author.name}</span>
                                    </div>
                                    <span className="text-gray-600">•</span>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{article.readTime} min</span>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </section>

            {/* Newsletter Section */}
            <section className="border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Stay in the Loop
                        </h2>
                        <p className="text-xl text-gray-400 mb-8">
                            Get the latest stories, playlists, and reviews delivered to your inbox
                        </p>
                        <div className="flex gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}