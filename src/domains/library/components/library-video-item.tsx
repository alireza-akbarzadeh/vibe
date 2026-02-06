import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    MoreHorizontal,
    Play,
    Share2
} from "lucide-react";
import {
    fadeInUp
} from "@/components/motion/motion-page.tsx";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import type { Video } from "@/domains/library/store/library-store-types";




export function VideoItem({ video }: { video: Video }) {
    const remainingSeconds = video.duration ? Math.floor(video.duration * (1 - video.progress / 100)) : 0;
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    const navigate = useNavigate()

    return (
        <motion.div
            variants={fadeInUp}
            // We remove initial="initial" from here if it's hiding the card.
            // We use 'group' for the hover state instead of a variant to keep it simple and bug-free.
            className="group cursor-pointer relative block"
        >
            {/* Image container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-zinc-950 ring-1 ring-white/5 shadow-2xl">
                <img
                    src={video.poster_path}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-[0.4] group-hover:blur-[2px]"
                    alt={video.title}
                />

                {/* Progress Bar - Stays visible */}
                <div className="absolute bottom-0 left-0 right-0 h-1 z-30 bg-white/10">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${video.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary relative"
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-primary blur-md" />
                    </motion.div>
                </div>

                {/* Play Button Overlay - Using Framer Motion 'animate' based on group hover */}
                <Link to="/play/$playId" params={{ playId: video.id.toString() }} className="absolute inset-0 z-40 flex!  items-center justify-center pointer-events-none">
                    <motion.div
                        initial="hidden"
                        // This tells the button to show only when the 'group' is hovered
                        animate={undefined}
                        className="relative opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out"
                    >
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        <div className="relative size-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                            <Play className="size-7 fill-current ml-1" />
                        </div>
                    </motion.div>
                </Link>

                {/* Time Left Badge */}
                <div className="absolute bottom-4 right-3 z-20 transition-all duration-500 group-hover:translate-x-12 group-hover:opacity-0">
                    <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-white tabular-nums uppercase tracking-widest">
                            {video.progress > 0 && video.progress < 100
                                ? `${remainingMinutes}m left`
                                : video.duration ? `${Math.floor(video.duration / 60)}:00` : "HD"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Details Section - Always Visible */}
            <div className="px-1">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                            {video.category}
                        </span>
                        {video.progress === 100 && (
                            <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                                Finished
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        {video.year}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {video.title}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image src={video.channelAvatar} className="size-6 rounded-full ring-1 ring-white/10" />
                        <span className="text-[11px] font-bold text-white/40 tracking-tight">
                            {video.channel}
                        </span>
                    </div>

                    <div className="flex gap-1">
                        <button className="p-2 text-white/20 hover:text-white transition-all">
                            <Share2 className="size-4" />
                        </button>
                        <button className="p-2 text-white/20 hover:text-white transition-all">
                            <MoreHorizontal className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}