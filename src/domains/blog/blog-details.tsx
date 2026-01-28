/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { useNavigate, useParams, useRouter } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import {
    ArrowLeft, Bookmark, Calendar, ChevronRight, Clock,
    Heart,
    MessageSquare, Quote, Share2,
    Sparkles
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { actions, blogStore } from '@/domains/blog/blog.store';
import { generateSlug } from '@/lib/utils';
import { MOCK_ARTICLES } from './blog-mock';
import { ArticleComments } from './components/article-comment';

export function BlogPost() {
    const { blogslug } = useParams({ from: '/(blog)/blog/$blogslug' });
    const navigate = useNavigate();
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);

    const article = MOCK_ARTICLES.find(a => generateSlug(a.title) === blogslug);

    // Global Store Subscriptions
    const isLiked = useStore(blogStore, (s) => article ? s.likes.includes(article.id) : false);
    const isSaved = useStore(blogStore, (s) => article ? s.bookmarks.includes(article.id) : false);

    const [scrolledPastHero, setScrolledPastHero] = useState(false);

    // Smooth Reading Progress
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        if (!article) return;
        const handleScroll = () => {
            // Update Reading Progress in Store
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const progress = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

            if (progress > (blogStore.state.readingProgress[article.id] || 0)) {
                actions.updateProgress(article.id, progress);
            }

            // Show mini-header after hero
            setScrolledPastHero(scrollTop > windowHeight * 0.7);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [article]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
    };

    if (!article) return <div className="p-20 text-center text-white">Article not found.</div>;

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-purple-500/30">
            {/* 1. DYNAMIC STICKY NAV */}
            <AnimatePresence>
                {scrolledPastHero && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[60] px-6 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <button type='button' onClick={() => router.history.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ArrowLeft size={18} />
                            </button>
                            <div className="h-6 w-px bg-white/10" />
                            <h2 className="text-sm font-bold truncate max-w-50 md:max-w-md">{article.title}</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type='button' onClick={() => actions.toggleLike(article.id)} className={isLiked ? "text-pink-500" : "text-neutral-400"}>
                                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                            </button>
                            <button type='button' onClick={() => actions.toggleBookmark(article.id)} className={isSaved ? "text-purple-500" : "text-neutral-400"}>
                                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                            <button
                                type='button'
                                onClick={() => {
                                    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="flex items-center gap-1.5 text-neutral-400 hover:text-white"
                            >
                                <MessageSquare size={18} />
                                <span className="text-xs font-bold">24</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 z-[70] origin-left"
                style={{ scaleX }}
            />

            {/* Floating Back Button (Hidden when sticky nav is active) */}
            {!scrolledPastHero && (
                <motion.button
                    onClick={() => router.history.back()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed top-8 left-8 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-2xl"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit</span>
                </motion.button>
            )}

            {/* 2. ENHANCED HERO */}
            <section className="relative h-[90vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#050505] z-10" />
                <motion.div
                    initial={{ scale: 1.2, filter: 'blur(10px)' }}
                    animate={{ scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img src={article.image} className="w-full h-full object-cover opacity-70" alt="" />
                </motion.div>

                <div className="absolute bottom-32 left-0 right-0 z-20 max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="px-4 py-2 bg-purple-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                            {article.category}
                        </span>
                        <h1 className="text-6xl md:text-9xl font-black text-white mb-8 leading-[0.85] tracking-tighter italic">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-8 text-neutral-400">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Clock size={14} className="text-purple-500" /> {article.readTime} MIN READ
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Calendar size={14} className="text-pink-500" /> {article.publishDate}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. ARTICLE CONTENT */}
            <article className="max-w-4xl mx-auto px-6 relative z-20 pb-32">
                <div className="flex items-center justify-between py-12 border-b border-white/5 mb-16">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img src={article.author.avatar} className="w-16 h-16 rounded-2xl object-cover border border-white/10" alt="" />
                            <div className="absolute -bottom-1 -right-1 bg-purple-600 p-1 rounded-md border-2 border-black">
                                <Sparkles size={10} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="text-white font-black text-xl tracking-tight">{article.author.name}</div>
                            <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">{article.author.role}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => actions.toggleLike(article.id)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all ${isLiked ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_20px_rgba(219,39,119,0.3)]' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                                }`}
                        >
                            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                            <span className="font-black text-xs uppercase tracking-widest">Appreciate</span>
                        </motion.button>

                        <div className="relative">
                            <button
                                type='button'
                                onClick={() => handleCopyLink()} className="p-4 rounded-2xl border border-white/10 bg-white/5 text-neutral-400 hover:text-white transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div ref={contentRef} className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-neutral-400 prose-p:leading-relaxed prose-strong:text-white">

                    <p className="text-2xl text-white leading-snug mb-12 font-medium">
                        {article.excerpt}
                    </p>

                    <p>
                        The intersection of sound and technology has reached a tipping point. As we move further into the decade,
                        the tools at a creator's disposal are no longer just instruments—they are extensions of the subconscious.
                    </p>

                    <div className="my-16 p-12 bg-linear-to-br from-purple-900/20 to-pink-900/10 border border-white/5 rounded-[3rem] relative overflow-hidden group">
                        <Quote className="absolute -top-4 -right-4 w-32 h-32 text-white/5 -rotate-12" />
                        <blockquote className="text-4xl font-black text-white leading-[1.1] border-none p-0 relative z-10 italic">
                            "Innovation is not about the tool, but about the space the tool allows you to inhabit."
                        </blockquote>
                        <div className="mt-8 flex items-center gap-3 relative z-10">
                            <div className="w-10 h-px bg-purple-500" />
                            <cite className="text-purple-400 font-black uppercase tracking-widest not-italic text-xs">Internal Editorial</cite>
                        </div>
                    </div>

                    <h3>The Sonic Revolution</h3>
                    <p>
                        Consider the shift from analog to digital. It wasn't just a change in fidelity; it was a change in philosophy.
                        In this article, we dive deep into how modern artists are reclaiming the "warmth" of the past using the
                        precision of the future.
                    </p>
                </div>

                <div id="comments-section" className="mt-24">
                    <ArticleComments />
                </div>

                {/* 4. UP NEXT / RELATED */}
                <div className="mt-32 pt-20 border-t border-white/5">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-4xl font-black text-white tracking-tighter italic">Next Stories</h3>
                        <button
                            type='button'
                            className="text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-purple-400 flex items-center gap-2 transition-colors">
                            View All <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {MOCK_ARTICLES.filter(a => a.id !== article.id).slice(0, 2).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate({ to: "/blog/$blogslug", params: { blogslug: generateSlug(item.title) } })}
                                className="group cursor-pointer bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-4 transition-all hover:bg-white/[0.04]"
                            >
                                <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 relative">
                                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="px-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2 block">{item.category}</span>
                                    <h4 className="font-bold text-2xl text-white group-hover:text-purple-400 transition-colors leading-tight">{item.title}</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
}