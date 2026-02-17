import { motion, useScroll, useTransform } from "framer-motion";
import {
    ArrowDownToLine,
    Laptop,
    Layers,
    MonitorPlay,
    Shield,
    Smartphone,
    Sparkles,
    Tablet,
    Tv,
    Wifi,
    Zap,
} from "lucide-react";
import { useRef } from "react";
import { Image } from "@/components/ui/image";
import { Typography } from "@/components/ui/typography";

// ─── Feature Highlights ────────────────────────────────────────
const features = [
    {
        icon: Sparkles,
        title: "AI-Powered Curation",
        desc: "Our algorithms learn from every play, skip, and like—serving you content that feels handpicked.",
        gradient: "from-violet-500 to-fuchsia-500",
    },
    {
        icon: Zap,
        title: "Instant Playback",
        desc: "Adaptive bitrate streaming ensures zero buffering. 4K HDR content starts in under a second.",
        gradient: "from-cyan-500 to-blue-500",
    },
    {
        icon: ArrowDownToLine,
        title: "Offline Mode",
        desc: "Download entire playlists and movies. Watch on flights, in tunnels, or off the grid.",
        gradient: "from-emerald-500 to-green-500",
    },
    {
        icon: Shield,
        title: "Zero Ads, Zero Tracking",
        desc: "No pre-roll ads. No mid-roll interrupts. Your data stays yours—always.",
        gradient: "from-orange-500 to-amber-500",
    },
    {
        icon: Layers,
        title: "Spatial Audio",
        desc: "Dolby Atmos and spatial audio transform your headphones into a 360° sound stage.",
        gradient: "from-pink-500 to-rose-500",
    },
    {
        icon: MonitorPlay,
        title: "Multi-Screen Support",
        desc: "Stream on up to 4 screens simultaneously. Family sharing built right in.",
        gradient: "from-indigo-500 to-purple-500",
    },
];

const devices = [
    { icon: Smartphone, label: "Mobile", sub: "iOS & Android" },
    { icon: Tablet, label: "Tablet", sub: "iPad & Android" },
    { icon: Laptop, label: "Desktop", sub: "Mac & Windows" },
    { icon: Tv, label: "Smart TV", sub: "All brands" },
];

// ─── Feature Card ──────────────────────────────────────────────
function FeatureCard({
    feature,
    index,
}: {
    feature: (typeof features)[number];
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative"
        >
            <div className="relative h-full p-6 md:p-8 rounded-3xl bg-white/3 border border-white/6 overflow-hidden transition-all duration-500 hover:bg-white/6 hover:border-white/12">
                {/* Hover glow */}
                <div
                    className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500`}
                />

                <div
                    className={`inline-flex p-3 rounded-2xl bg-linear-to-br ${feature.gradient} mb-5`}
                >
                    <feature.icon className="w-6 h-6 text-white" />
                </div>

                <Typography.H3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                </Typography.H3>
                <Typography.P className="m-0! text-sm text-gray-400 leading-relaxed">
                    {feature.desc}
                </Typography.P>

                {/* Corner glow */}
                <div
                    className={`absolute -bottom-8 -right-8 w-24 h-24 bg-linear-to-br ${feature.gradient} opacity-15 rounded-full blur-2xl group-hover:opacity-25 transition-opacity duration-500`}
                />
            </div>
        </motion.div>
    );
}

// ─── Device Section ────────────────────────────────────────────
function DeviceShowcase() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const rotateX = useTransform(scrollYProgress, [0, 0.5], [8, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

    return (
        <div ref={ref} className="mt-28">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-center mb-14"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 mb-5">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-gray-300">
                        Seamless sync across all devices
                    </span>
                </div>

                <Typography.H2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    One Account.{" "}
                    <span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        Everywhere.
                    </span>
                </Typography.H2>
                <Typography.P className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Start on your phone, continue on your TV. Your experience follows
                    you.
                </Typography.P>
            </motion.div>

            {/* TV Mockup */}
            <motion.div
                style={{ rotateX, scale, perspective: 1200 }}
                className="relative mx-auto w-full max-w-4xl"
            >
                <div className="relative aspect-video rounded-3xl bg-linear-to-br from-gray-800 to-gray-900 p-1.5 shadow-2xl shadow-purple-500/10 border border-white/6">
                    <div className="relative h-full rounded-2xl overflow-hidden bg-black">
                        <Image
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop"
                            alt="Streaming content"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">V</span>
                                </div>
                                <span className="text-white/60 text-xs md:text-sm">
                                    Now Playing
                                </span>
                            </div>
                            <Typography.H3 className="text-white text-lg md:text-2xl font-bold">
                                Interstellar: Beyond Time
                            </Typography.H3>
                        </div>
                    </div>
                </div>

                {/* Stand */}
                <div className="mx-auto w-32 h-3 bg-linear-to-r from-gray-800 via-gray-700 to-gray-800 rounded-b-lg" />
                <div className="mx-auto w-48 h-1 bg-gray-800 rounded-full" />
            </motion.div>

            {/* Devices grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-2xl mx-auto">
                {devices.map((device, index) => (
                    <motion.div
                        key={device.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/3 border border-white/6 hover:bg-white/6 hover:border-white/12 transition-all"
                    >
                        <device.icon className="w-6 h-6 text-purple-400" />
                        <span className="text-white text-sm font-medium">
                            {device.label}
                        </span>
                        <span className="text-gray-500 text-xs">{device.sub}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Section ──────────────────────────────────────────────
export default function FeatureShowcaseSection() {
    return (
        <section className="relative py-28 bg-[#0a0a0a] overflow-hidden">
            {/* Subtle grid background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <Typography.H2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Built for the{" "}
                        <span className="bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Modern Streamer
                        </span>
                    </Typography.H2>
                    <Typography.P className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Every pixel, every feature—crafted for an uncompromising
                        entertainment experience.
                    </Typography.P>
                </motion.div>

                {/* Feature cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            feature={feature}
                            index={index}
                        />
                    ))}
                </div>

                {/* Device showcase */}
                <DeviceShowcase />
            </div>
        </section>
    );
}
