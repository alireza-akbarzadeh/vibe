import { motion } from "framer-motion";
import {
    ArrowRight,
    Film,
    Globe,
    Headphones,
    Music,
    Play,
    Tv,
    Users,
    Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FeatureCard } from "./feature-about-card";

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-background" />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 180, 270, 360],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute top-1/4 left-1/4 w-150 h-150 rounded-full bg-linear-to-r from-accent/30 via-emerald-500/20 to-teal-500/30 blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [360, 270, 180, 90, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-l from-cyan-500/20 via-accent/20 to-emerald-500/30 blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            y: [0, -50, 0],
                            x: [0, 30, 0],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-accent/10 to-transparent blur-[80px]"
                    />
                </div>

                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Floating music notes and icons */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[20%] left-[10%] w-16 h-16 bg-gradient-to-br from-accent to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-accent/25"
                    >
                        <Music className="w-8 h-8 text-accent-foreground" />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, 25, 0],
                            rotate: [0, -15, 15, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                        className="absolute top-[15%] right-[15%] w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-500/25"
                    >
                        <Film className="w-10 h-10 text-background" />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                        className="absolute bottom-[25%] left-[8%] w-14 h-14 bg-gradient-to-br from-emerald-400 to-accent rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25"
                    >
                        <Headphones className="w-7 h-7 text-accent-foreground" />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, 20, 0],
                            rotate: [0, 20, -20, 0],
                        }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.5,
                        }}
                        className="absolute bottom-[30%] right-[10%] w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/25"
                    >
                        <Tv className="w-6 h-6 text-background" />
                    </motion.div>

                    {/* Floating album covers */}
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotateY: [0, 10, 0],
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[35%] left-[5%] w-24 h-24 rounded-2xl overflow-hidden shadow-2xl shadow-background/50 border border-border/50"
                    >
                        <div className="w-full h-full bg-gradient-to-br from-accent via-emerald-500 to-teal-600" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-8 h-8 text-foreground/80 fill-current" />
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, 20, 0],
                            rotateY: [0, -10, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.8,
                        }}
                        className="absolute top-[40%] right-[5%] w-28 h-28 rounded-2xl overflow-hidden shadow-2xl shadow-background/50 border border-border/50"
                    >
                        <div className="w-full h-full bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Music className="w-10 h-10 text-background/80" />
                        </div>
                    </motion.div>

                    {/* Animated waveform bars */}
                    <div className="absolute bottom-[20%] left-[20%] flex items-end gap-1">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: [20, 40, 20],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.1,
                                }}
                                className="w-2 bg-gradient-to-t from-accent to-emerald-400 rounded-full"
                                style={{ height: 20 }}
                            />
                        ))}
                    </div>

                    <div className="absolute top-[25%] right-[25%] flex items-end gap-1">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: [15, 35, 15],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.15,
                                }}
                                className="w-1.5 bg-gradient-to-t from-cyan-400 to-teal-400 rounded-full"
                                style={{ height: 15 }}
                            />
                        ))}
                    </div>

                    {/* Glowing orbs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[60%] left-[30%] w-4 h-4 rounded-full bg-accent blur-sm"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                        className="absolute top-[30%] right-[35%] w-3 h-3 rounded-full bg-cyan-400 blur-sm"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                        className="absolute bottom-[40%] right-[20%] w-5 h-5 rounded-full bg-emerald-400 blur-sm"
                    />
                </div>

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                    }}
                />

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={stagger}
                    className="relative z-10 max-w-5xl mx-auto px-6 text-center"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-border text-secondary-foreground text-sm mb-8"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Zap className="w-4 h-4 text-accent" />
                        </motion.div>
                        <span>Streaming redefined</span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none mb-6"
                    >
                        <span className="text-balance">Feel the</span>
                        <motion.span
                            className="block bg-gradient-to-r from-accent via-emerald-400 to-teal-400 bg-clip-text text-transparent"
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            style={{ backgroundSize: "200% 200%" }}
                        >
                            Vibe
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
                    >
                        One platform for all your entertainment. Stream millions of songs,
                        watch exclusive videos, and discover content that matches your mood.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-accent to-emerald-500 text-accent-foreground hover:opacity-90 px-8 h-14 text-base shadow-lg shadow-accent/25 border-0"
                            >
                                Start Streaming
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-border hover:bg-secondary/80 px-8 h-14 text-base bg-background/50 backdrop-blur-sm"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                Watch Demo
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={fadeInUp}
                        className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-border/50 max-w-xl mx-auto"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="cursor-default"
                        >
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
                                50M+
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Songs</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="cursor-default"
                        >
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                                10K+
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Videos</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="cursor-default"
                        >
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-accent bg-clip-text text-transparent">
                                5M+
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Users</div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 rounded-full bg-accent"
                        />
                    </div>
                </motion.div>
            </section>

            {/* About Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid lg:grid-cols-2 gap-16 items-center"
                    >
                        <div>
                            <span className="text-sm uppercase tracking-widest text-accent mb-4 block">
                                About Vibe
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                                Entertainment that moves with you
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                                We built Vibe because we believe entertainment should be
                                effortless. No more switching between apps for music and video.
                                Everything you love, unified in one beautiful experience.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Founded in 2024, our mission is to create the most immersive
                                streaming platform that adapts to your lifestyle. Whether you
                                are commuting, working out, or relaxing at home, Vibe delivers
                                the perfect content for every moment.
                            </p>
                            <Button
                                variant="outline"
                                className="border-border hover:bg-secondary bg-transparent"
                            >
                                Our Story
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="aspect-square bg-secondary rounded-2xl p-6 flex flex-col justify-between"
                                >
                                    <Headphones className="w-10 h-10 text-accent" />
                                    <div>
                                        <div className="text-2xl font-bold">Music</div>
                                        <div className="text-sm text-muted-foreground">
                                            Lossless audio
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="aspect-square bg-accent rounded-2xl p-6 flex flex-col justify-between text-accent-foreground"
                                >
                                    <Tv className="w-10 h-10" />
                                    <div>
                                        <div className="text-2xl font-bold">Video</div>
                                        <div className="text-sm opacity-80">4K streaming</div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="aspect-square bg-card border border-border rounded-2xl p-6 flex flex-col justify-between"
                                >
                                    <Users className="w-10 h-10 text-muted-foreground" />
                                    <div>
                                        <div className="text-2xl font-bold">Social</div>
                                        <div className="text-sm text-muted-foreground">
                                            Share playlists
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="aspect-square bg-secondary rounded-2xl p-6 flex flex-col justify-between"
                                >
                                    <Globe className="w-10 h-10 text-accent" />
                                    <div>
                                        <div className="text-2xl font-bold">Global</div>
                                        <div className="text-sm text-muted-foreground">
                                            190+ countries
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 bg-secondary/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm uppercase tracking-widest text-accent mb-4 block">
                            Why Vibe
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Everything you need
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Film className="w-6 h-6" />}
                            title="Movies & Series"
                            description="Discover thousands of movies and exclusive series, curated for your perfect viewing experience."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Music className="w-6 h-6" />}
                            title="Music Streaming"
                            description="Stream your favorite tracks anytime, anywhere, with playlists that adapt to your mood."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6" />}
                            title="Community"
                            description="Connect with friends, share playlists, and discover what is trending in real-time."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="bg-card border border-border rounded-3xl p-12 md:p-16 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                                Ready to feel the vibe?
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                                Join millions of users who have already discovered a better way
                                to stream. Start your free trial today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    size="lg"
                                    className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 h-12"
                                >
                                    Start Free Trial
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-border hover:bg-secondary px-8 h-12 bg-transparent"
                                >
                                    View Plans
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
