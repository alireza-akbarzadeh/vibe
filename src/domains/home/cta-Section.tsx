import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Check,
    Film,
    Music,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

const trustBadges = [
    "7-day free trial",
    "Cancel anytime",
    "No credit card required",
];

export default function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-[#0a0a0a]">
                <motion.div
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute inset-0 opacity-30"
                    style={{
                        background:
                            "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 25%, #ec4899 50%, #8b5cf6 75%, #06b6d4 100%)",
                        backgroundSize: "400% 400%",
                    }}
                />
                <div className="absolute inset-0 bg-[#0a0a0a]/80" />
            </div>

            {/* Floating icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="absolute top-20 left-[10%] p-4 rounded-2xl bg-purple-500/20 backdrop-blur-sm border border-purple-500/20"
                >
                    <Music className="w-8 h-8 text-purple-400" />
                </motion.div>

                <motion.div
                    animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="absolute bottom-20 right-[10%] p-4 rounded-2xl bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/20"
                >
                    <Film className="w-8 h-8 text-cyan-400" />
                </motion.div>

                <motion.div
                    animate={{ y: [-15, 15, -15], x: [-10, 10, -10] }}
                    transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="absolute top-1/3 right-[20%] p-3 rounded-xl bg-pink-500/20 backdrop-blur-sm border border-pink-500/20"
                >
                    <Sparkles className="w-6 h-6 text-pink-400" />
                </motion.div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Live badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        <Typography.S className="text-sm text-gray-300">
                            Join millions of streamers worldwide
                        </Typography.S>
                    </div>

                    <Typography.H2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        Your Next Obsession{" "}
                        <span className="block bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                            Awaits
                        </span>
                    </Typography.H2>

                    <Typography.P className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Unlimited music and movies. Zero ads. One simple price. Start
                        your free trial today and discover a new era of entertainment.
                    </Typography.P>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Button
                            onClick={() => navigate({ to: "/movies" })}
                            size="lg"
                            className="group relative px-10 py-7 text-lg font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-pink-600 to-cyan-600" />
                            <motion.div
                                animate={{ x: ["0%", "100%"] }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />
                            <Typography.S className="relative z-10 flex items-center gap-2 text-white">
                                Start Streaming Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Typography.S>
                        </Button>

                        <span className="text-gray-500">or</span>

                        <Button
                            onClick={() =>
                                navigate({ to: "/plans", resetScroll: true })
                            }
                            variant="ghost"
                            size="lg"
                            className="px-8 py-7 text-lg font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300"
                        >
                            View Plans
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-gray-500 text-sm">
                        {trustBadges.map((badge) => (
                            <div
                                key={badge}
                                className="flex items-center gap-2"
                            >
                                <Check className="w-4 h-4 text-green-500" />
                                <Typography.S>{badge}</Typography.S>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
