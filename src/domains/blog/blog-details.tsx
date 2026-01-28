import { useNavigate, useRouter } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Bookmark, Calendar,
    Clock, Eye, Facebook,
    Heart, Link2, MessageCircle,
    Music, Play, Quote, Send, Share2, ThumbsUp, Twitter
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateSlug } from '@/lib/utils';

export function BlogPost() {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likes, setLikes] = useState(1243);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [readProgress, setReadProgress] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([
        {
            id: 1,
            author: { name: "Alex Turner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
            content: "This article perfectly captures the essence of Zimmer's work. The way you describe the sonic layering is spot on!",
            likes: 24,
            timestamp: "2 hours ago"
        },
        {
            id: 2,
            author: { name: "Maya Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
            content: "I've been following this series and each piece gets better. Would love to see more on Göransson's work.",
            likes: 18,
            timestamp: "5 hours ago"
        }
    ]);

    const article = {
        title: "The Evolution of Sound: How Electronic Music Shaped Modern Cinema",
        subtitle: "From Vangelis to Hans Zimmer, exploring the profound relationship between electronic soundscapes and visual storytelling",
        category: 'Music Stories',
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80",
        author: {
            name: "Elena Rodriguez",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
            role: "Music Curator",
            bio: "Elena has been exploring the intersection of sound and cinema for over a decade, writing for major publications and curating soundtracks for film festivals worldwide."
        },
        readTime: 8,
        publishDate: "January 25, 2026",
        views: 12453
    };

    const relatedArticles = [
        {
            id: 2,
            title: "Blade Runner 2049: Deconstructing Zimmer's Score",
            image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
            readTime: 15
        },
        {
            id: 3,
            title: "Nolan's Tenet: When Music Moves Backward",
            image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
            readTime: 11
        },
        {
            id: 4,
            title: "Lo-Fi Beats and the Art of Focus",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
            readTime: 6
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            setReadProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
    };

    const handleShare = (platform) => {
        console.log(`Sharing to ${platform}`);
        setShowShareMenu(false);
    };

    const handleComment = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            const newComment = {
                id: comments.length + 1,
                author: { name: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" },
                content: comment,
                likes: 0,
                timestamp: "Just now"
            };
            setComments([newComment, ...comments]);
            setComment('');
        }
    };
    const router = useRouter();
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-black">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 h-1 bg-linear-to-r from-purple-600 to-pink-600 z-50"
                style={{ width: `${readProgress}%` }}
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <motion.button
                        onClick={() => router.history.back()}
                        whileHover={{ x: -4 }}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Stories</span>
                    </motion.button>
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setIsSaved(!isSaved)}
                            className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                                }`}
                        >
                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                        </motion.button>

                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </motion.button>

                            <AnimatePresence>
                                {showShareMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-12 bg-zinc-900 border border-white/10 rounded-xl p-2 w-48"
                                    >
                                        {[
                                            { icon: Twitter, label: 'Twitter', platform: 'twitter' },
                                            { icon: Facebook, label: 'Facebook', platform: 'facebook' },
                                            { icon: Link2, label: 'Copy Link', platform: 'link' }
                                        ].map((item) => (
                                            <button
                                                type='button'
                                                key={item.platform}
                                                onClick={() => handleShare(item.platform)}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                <item.icon className="w-4 h-4" />
                                                <span className="text-sm">{item.label}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Image */}
            <section className="relative h-[70vh] mt-16 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-black z-10" />
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
            </section>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-6 -mt-32 relative z-20">
                {/* Category & Meta */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-6"
                >
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm text-white border border-white/20">
                        {article.category}
                    </span>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{article.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{article.views.toLocaleString()} views</span>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
                >
                    {article.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-300 mb-8 leading-relaxed"
                >
                    {article.subtitle}
                </motion.p>

                {/* Author & Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between pb-8 mb-12 border-b border-white/10"
                >
                    <div className="flex items-center gap-4">
                        <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="w-14 h-14 rounded-full border-2 border-white/20"
                        />
                        <div>
                            <div className="text-white font-semibold">{article.author.name}</div>
                            <div className="text-sm text-gray-400">{article.author.role}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${isLiked
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{likes}</span>
                        </motion.button>

                        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10">
                            <MessageCircle className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-400 font-medium">{comments.length}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Article Body */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="prose prose-invert prose-lg max-w-none mb-16"
                >
                    <p className="text-gray-300 leading-relaxed mb-6">
                        In the dimly lit studios of the late 1970s, something revolutionary was taking shape. While traditional orchestras dominated film scores, a handful of pioneers began experimenting with electronic synthesizers, creating soundscapes that would forever change how we experience cinema.
                    </p>

                    <p className="text-gray-300 leading-relaxed mb-6">
                        Vangelis's haunting score for Blade Runner (1982) wasn't just music—it was the sonic embodiment of a dystopian future. The synthesizers didn't merely accompany the visuals; they became part of the film's DNA, blurring the line between diegetic and non-diegetic sound.
                    </p>

                    <div className="my-12 p-8 bg-linear-to-r from-purple-900/20 to-pink-900/20 border-l-4 border-purple-500 rounded-r-xl">
                        <Quote className="w-8 h-8 text-purple-400 mb-4" />
                        <p className="text-2xl text-white font-medium italic leading-relaxed mb-4">
                            "Music in film is not about notes and chords—it's about creating an emotional landscape that the audience can inhabit."
                        </p>
                        <p className="text-gray-400">— Hans Zimmer</p>
                    </div>

                    <h2 className="text-3xl font-bold text-white mt-12 mb-6">The Rise of Hybrid Scoring</h2>

                    <p className="text-gray-300 leading-relaxed mb-6">
                        Fast forward to the 2000s, and Hans Zimmer had perfected what we now call "hybrid scoring"—the seamless integration of electronic and orchestral elements. His work on Inception (2010) demonstrated how electronic manipulation of a single musical phrase could become a film's emotional anchor.
                    </p>

                    <p className="text-gray-300 leading-relaxed mb-6">
                        The famous "BRAAAM" sound wasn't just a sonic effect; it was a narrative device, a way of bending time itself within the score. This approach has influenced countless composers and redefined what film music could be.
                    </p>

                    <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                            <Play className="w-16 h-16 text-white/40" />
                        </div>
                        <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                            <Music className="w-16 h-16 text-white/40" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mt-12 mb-6">Modern Innovations</h2>

                    <p className="text-gray-300 leading-relaxed mb-6">
                        Today's composers like Ludwig Göransson, Trent Reznor, and Hildur Guðnadóttir are pushing boundaries even further. Göransson's work on Tenet involved recording orchestral pieces and then manipulating them to play backward—a perfect sonic metaphor for the film's time-bending narrative.
                    </p>

                    <p className="text-gray-300 leading-relaxed mb-6">
                        Electronic music has evolved from a novelty to an essential tool in the cinematic composer's arsenal. It offers infinite possibilities for texture, mood, and atmosphere—elements that can make or break a film's emotional impact.
                    </p>
                </motion.div>

                {/* Author Bio */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 p-8 bg-white/5 border border-white/10 rounded-2xl"
                >
                    <div className="flex items-start gap-6">
                        <img
                            src={article.author.avatar}
                            alt={article.author.name}
                            className="w-24 h-24 rounded-full border-2 border-white/20"
                        />
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">About {article.author.name}</h3>
                            <p className="text-gray-400 leading-relaxed mb-4">{article.author.bio}</p>
                            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                Follow
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Comments Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-white mb-8">Discussion ({comments.length})</h2>

                    {/* Add Comment */}
                    <form onSubmit={handleComment} className="mb-8">
                        <div className="flex gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                                alt="You"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20 resize-none"
                                    rows={3}
                                />
                                <div className="mt-3 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={!comment.trim()}
                                        className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Post Comment
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
                            >
                                <img
                                    src={comment.author.avatar}
                                    alt={comment.author.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-semibold text-white">{comment.author.name}</span>
                                        <span className="text-sm text-gray-500">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed mb-3">{comment.content}</p>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type='button' className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>{comment.likes}</span>
                                        </button>
                                        <button
                                            type='button' className="text-sm text-gray-400 hover:text-white transition-colors">
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Related Articles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold text-white mb-8">Continue Reading</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedArticles.map((related) => (
                            <motion.article
                                key={related.id}
                                whileHover={{ y: -4 }}
                                className="group cursor-pointer"
                                onClick={() => navigate({ to: "/blog/$blogslug", params: { blogslug: generateSlug(related.title) } })}

                            >
                                <div className="aspect-4/5 rounded-xl overflow-hidden mb-4 bg-gray-900">
                                    <img
                                        src={related.image}
                                        alt={related.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                                    {related.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span>{related.readTime} min read</span>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </motion.div>
            </article>
        </div>
    );
}