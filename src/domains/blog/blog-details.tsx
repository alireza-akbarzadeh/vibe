/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */

import { useNavigate, useParams, useRouter } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import {
    ArrowLeft, Bookmark,
    ChevronRight, Clock, Facebook,
    Heart,
    Quote, Share2, Sparkles,
    Twitter
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { actions, blogStore } from '@/domains/blog/blog.store';
import { generateSlug } from '@/lib/utils';
import { MOCK_ARTICLES } from './blog-mock';
import { ArticleComments } from './components/article-comment';
import ReactionSection from './components/reaction-section';

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
    const [activeSection, setActiveSection] = useState("intro");

    // Smooth Reading Progress
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Sections for Table of Contents
    const sections = [
        { id: 'intro', title: 'Introduction' },
        { id: 'sonic-revolution', title: 'The Sonic Revolution' },
        { id: 'future-vision', title: 'Future Vision' },
        { id: 'comments-section', title: 'Community' }
    ];

    useEffect(() => {
        if (!article) return;
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const progress = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

            if (progress > (blogStore.state.readingProgress[article.id] || 0)) {
                actions.updateProgress(article.id, progress);
            }

            setScrolledPastHero(scrollTop > windowHeight * 0.7);

            // Simple ScrollSpy logic
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && scrollTop >= element.offsetTop - 200) {
                    setActiveSection(section.id);
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [article, sections]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
    };

    if (!article) return <div className="p-20 text-center text-white">Article not found.</div>;

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-purple-500/30">
            {/* 1. STICKY TOP NAV */}
            <AnimatePresence>
                {scrolledPastHero && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-60 px-6 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <button type='button' onClick={() => router.history.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <ArrowLeft size={18} />
                            </button>
                            <h2 className="text-sm font-bold truncate max-w-40 md:max-w-md text-white">{article.title}</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type='button' onClick={() => actions.toggleLike(article.id)} className={isLiked ? "text-pink-500" : "text-neutral-400"}>
                                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                            </button>
                            <button type='button' onClick={() => actions.toggleBookmark(article.id)} className={isSaved ? "text-purple-500" : "text-neutral-400"}>
                                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-pink-600 z-70 origin-left" style={{ scaleX }} />

            {/* 2. LEFT SIDE ACTION BAR & TOC */}
            <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-10 z-40">
                <div className="flex flex-col items-center gap-4 bg-white/[0.03] border border-white/5 backdrop-blur-md p-2 rounded-full shadow-2xl">
                    <button type='button' onClick={() => actions.toggleLike(article.id)} className={`p-4 rounded-full transition-all ${isLiked ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'hover:bg-white/10 text-neutral-500'}`}>
                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    <button
                        type='button'
                        onClick={() => actions.toggleBookmark(article.id)} className={`p-4 rounded-full transition-all ${isSaved ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'hover:bg-white/10 text-neutral-500'}`}>
                        <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                    <button type='button' onClick={handleCopyLink} className="p-4 rounded-full hover:bg-white/10 text-neutral-500 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-6 pl-2">
                    {sections.map((s) => (
                        <button
                            type='button'
                            key={s.id}
                            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                            className="group flex items-center gap-4 text-left"
                        >
                            <div className={`h-1 transition-all duration-500 rounded-full ${activeSection === s.id ? 'w-10 bg-purple-500' : 'w-4 bg-white/10 group-hover:bg-white/30'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeSection === s.id ? 'text-white opacity-100' : 'text-neutral-600 opacity-0 group-hover:opacity-100'}`}>
                                {s.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. HERO SECTION */}
            <section id="intro" className="relative h-[95vh] overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/40 to-[#050505] z-10" />
                <motion.img
                    initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2 }}
                    src={article.image} className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-24 left-0 right-0 z-20 max-w-5xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {article.category}
                            </span>
                            <div className="h-px w-12 bg-white/20" />
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} className="text-purple-500" /> {article.readTime} MIN READ
                            </span>
                        </div>
                        <h1 className="text-7xl md:text-[10rem] font-black text-white mb-10 leading-[0.8] tracking-tighter italic">
                            {article.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* 4. CONTENT */}
            <article className="max-w-4xl mx-auto px-6 relative z-20 pb-32">
                <div className="flex items-center justify-between py-16 border-b border-white/5 mb-20">
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <img src={article.author.avatar} className="w-20 h-20 rounded-[2rem] object-cover border border-white/10 transition-transform group-hover:scale-105" alt="" />
                            <div className="absolute -bottom-2 -right-2 bg-purple-600 p-1.5 rounded-xl border-4 border-[#050505]">
                                <Sparkles size={12} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="text-white font-black text-2xl tracking-tight">{article.author.name}</div>
                            <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1">{article.author.role}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button type='button' className="p-4 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all"><Twitter size={20} /></button>
                        <button type='button' className="p-4 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all"><Facebook size={20} /></button>
                    </div>
                </div>

                <div ref={contentRef} className="prose prose-invert prose-2xl max-w-none prose-headings:text-white prose-headings:font-black prose-p:text-neutral-400 prose-p:leading-relaxed prose-strong:text-white prose-img:rounded-[3rem] prose-img:border prose-img:border-white/5">
                    <p className="text-3xl text-white leading-tight mb-16 font-semibold italic opacity-90">
                        {article.excerpt}
                    </p>

                    <h3 id="sonic-revolution" className="text-5xl mt-24 mb-10">The Sonic Revolution</h3>
                    <p>
                        We are entering an era where sound is no longer a passive background element but a dynamic, living entity.
                        In the landscape of modern media, the "perfect" sound is the one that reacts to the user's emotional state in real-time.
                    </p>

                    <div className="my-20 p-16 bg-linear-to-br from-purple-900/20 to-pink-900/10 border border-white/5 rounded-[4rem] relative overflow-hidden">
                        <Quote className="absolute -top-6 -right-6 w-48 h-48 text-white/5 -rotate-12" />
                        <blockquote className="text-5xl font-black text-white leading-none border-none p-0 relative z-10 italic tracking-tighter">
                            "Innovation is the space between what we know and what we feel."
                        </blockquote>
                    </div>

                    <h3 id="future-vision" className="text-5xl mt-24 mb-10">Future Vision</h3>
                    <p>
                        Looking ahead to 2026 and beyond, the tools of creation are becoming invisible. The hardware is fading away,
                        leaving only the raw intent of the artist. This shift marks the true beginning of the digital renaissance.
                    </p>
                </div>

                {/* 5. REACTION SECTION */}
                <ReactionSection articleId={article.id} />

                <div id="comments-section" className="mt-32">
                    <ArticleComments />
                </div>
            </article>

            {/* 6. RELATED FOOTER */}
            <footer className="bg-white/1 border-t border-white/5 py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-16">
                        <h3 className="text-5xl font-black text-white italic tracking-tighter">Keep Reading</h3>
                        <button type='button' onClick={() => navigate({ to: '/' })} className="group flex items-center gap-3 text-neutral-500 hover:text-white transition-colors">
                            <span className="text-xs font-black uppercase tracking-widest">The Feed</span>
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {MOCK_ARTICLES.filter(a => a.id !== article.id).slice(0, 2).map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -15 }}
                                onClick={() => navigate({ to: "/blog/$blogslug", params: { blogslug: generateSlug(item.title) } })}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-video rounded-[3.5rem] overflow-hidden mb-8 border border-white/5 relative">
                                    <img src={item.image} className="w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100" alt="" />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                                    <span className="absolute bottom-8 left-8 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                                        {item.category}
                                    </span>
                                </div>
                                <h4 className="text-4xl font-black text-white leading-tight group-hover:text-purple-400 transition-colors italic tracking-tighter">{item.title}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}