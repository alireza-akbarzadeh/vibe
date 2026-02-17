import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    Award,
    Film,
    Globe,
    Headphones,
    Shield,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import { Typography } from "@/components/ui/typography";
import {
    allMediaStatsQueryOptions,
    movieStatsQueryOptions,
    trackStatsQueryOptions,
} from "./home.queries";

// ─── Stats Card ────────────────────────────────────────────────
function StatCard({
    icon: Icon,
    value,
    label,
    subtitle,
    gradient,
    delay,
}: {
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    label: string;
    subtitle: string;
    gradient: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
        >
            <div className="relative h-full p-8 rounded-3xl bg-white/3 backdrop-blur-xl border border-white/8 overflow-hidden transition-all duration-500 hover:bg-white/6 hover:border-white/20 hover:scale-[1.02] hover:-translate-y-1">
                {/* Hover glow */}
                <div
                    className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`}
                />

                {/* Icon */}
                <div
                    className={`inline-flex p-4 rounded-2xl bg-linear-to-br ${gradient} mb-5 shadow-lg`}
                >
                    <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Value */}
                <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
                    {value}
                </div>

                {/* Label */}
                <Typography.H3 className="text-lg font-bold text-white/90 mb-1">
                    {label}
                </Typography.H3>
                <Typography.P className="text-sm text-gray-500 leading-relaxed m-0!">
                    {subtitle}
                </Typography.P>

                {/* Corner glow */}
                <div
                    className={`absolute -bottom-10 -right-10 w-32 h-32 bg-linear-to-br ${gradient} opacity-[0.15] rounded-full blur-2xl group-hover:opacity-25 transition-opacity duration-500`}
                />
            </div>
        </motion.div>
    );
}

export default function LiveStatsSection() {
    const { data: _allMediaData } = useQuery(allMediaStatsQueryOptions());
    const { data: movieData } = useQuery(movieStatsQueryOptions());
    const { data: trackData } = useQuery(trackStatsQueryOptions());

    const totalMovies = movieData?.data?.pagination?.total ?? 0;
    const totalTracks = trackData?.data?.pagination?.total ?? 0;

    const stats = [
        {
            icon: Film,
            value: totalMovies > 0 ? totalMovies.toLocaleString() : "4,200+",
            label: "Movies & Shows",
            subtitle: "From blockbusters to indie gems",
            gradient: "from-cyan-500 to-blue-600",
        },
        {
            icon: Headphones,
            value: totalTracks > 0 ? totalTracks.toLocaleString() : "100K+",
            label: "Songs & Tracks",
            subtitle: "Every genre, every mood",
            gradient: "from-purple-500 to-pink-600",
        },
        {
            icon: Users,
            value: "50M+",
            label: "Active Users",
            subtitle: "Growing community worldwide",
            gradient: "from-emerald-500 to-teal-600",
        },
        {
            icon: Globe,
            value: "190+",
            label: "Countries",
            subtitle: "Stream from anywhere",
            gradient: "from-orange-500 to-amber-600",
        },
    ];

    const features = [
        { icon: Zap, text: "Zero Ads", color: "text-yellow-400" },
        { icon: Shield, text: "4K HDR", color: "text-cyan-400" },
        { icon: Sparkles, text: "AI Curated", color: "text-purple-400" },
        { icon: Award, text: "Spatial Audio", color: "text-pink-400" },
        { icon: TrendingUp, text: "Offline Mode", color: "text-emerald-400" },
    ];

    return (
        <section className="relative py-28 bg-[#0a0a0a] overflow-hidden">
            {/* Top divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
                    >
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-cyan-300 font-medium">
                            Platform Stats
                        </span>
                    </motion.div>

                    <Typography.H2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Built for{" "}
                        <span className="bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Scale
                        </span>
                    </Typography.H2>
                    <Typography.P className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Real numbers. Real content. Real community.
                    </Typography.P>
                </motion.div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                    {stats.map((stat, index) => (
                        <StatCard key={stat.label} {...stat} delay={index * 0.1} />
                    ))}
                </div>

                {/* Feature pills row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.text}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + index * 0.08 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/4 border border-white/8 backdrop-blur-sm"
                        >
                            <feature.icon className={`w-4 h-4 ${feature.color}`} />
                            <span className="text-sm font-medium text-gray-300">
                                {feature.text}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
