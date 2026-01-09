import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { VIDEOS } from "@/constants/media";
import { useVideo } from "@/hooks/useVideo";
import { PlayButton } from "../play-button";
import { MoreVideoOptions } from "./more-video";
import { Video } from "./video";
import { VideoProgressbar } from "./video-progressbar";

type VideoPlayerProps = {
    src: string
    totalTime: string
    videoName: string
    year: string
    videoPoster: string

}

export function VideoPlayer(props: VideoPlayerProps) {

    const { src = VIDEOS.demo, videoPoster = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop", year = "2014", totalTime = "2:49:00", videoName = "Interstellar" } = props
    const [isHovered, setIsHovered] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const ref = useRef<HTMLVideoElement | null>(null)
    const { play } = useVideo(ref)


    const duration = "1:48:32"
    const formatTime = "2h 49m"
    const handleMouseLeave = () => {
        setIsHovered(true);
    };
    return (
        <motion.div className="mt-2"
            onMouseEnter={() => setIsHovered(true)}
            onDoubleClick={(event) => {
                setIsHovered(true)
                event.stopPropagation()
            }}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative">
                {/* Central device mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative mx-auto w-full max-w-full"
                >
                    {/* TV/Monitor mockup */}
                    <div className="relative">
                        <div className="aspect-video rounded-3xl bg-linear-to-br from-gray-800 to-gray-900 p-2 shadow-2xl shadow-purple-500/10">
                            <div className="relative h-full rounded-2xl overflow-hidden bg-black">
                                {isPlaying ?
                                    (
                                        <Video ref={ref} src={src} />
                                    )
                                    : (
                                        <img
                                            src={videoPoster}
                                            alt="Streaming content"
                                            className="w-full h-full object-cover"
                                        />

                                    )}

                                {/* UI overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-black/30">
                                    {/* Top bar */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{
                                                opacity: isHovered ? 1 : 0,
                                                y: isHovered ? 0 : -20,
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-3"
                                        >

                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        V
                                                    </span>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <span className="text-white/60 text-sm">
                                                        Now Playing
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>

                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, }}
                                        animate={{
                                            opacity: isHovered ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-3"
                                    >

                                        <PlayButton
                                            value={isPlaying}
                                            onOpenChange={(value) => {
                                                setIsPlaying(value)
                                                setIsHovered(false)
                                                play()
                                            }}
                                            size="medium" />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{
                                            opacity: isHovered ? 1 : 0,
                                            y: isHovered ? 0 : 20,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-3"
                                    >

                                        {/* Bottom content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">

                                            <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                                                {videoName}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-white/60 text-sm mb-4">
                                                    {year} • Sci-Fi • {formatTime}
                                                </p>
                                                <MoreVideoOptions />
                                            </div>



                                            {/* Progress bar */}
                                            <VideoProgressbar progress="80%" />
                                            <div className="flex justify-between text-white/50 text-xs">
                                                <span>{duration}</span>
                                                <span>{totalTime}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Stand */}
                        <div className="mx-auto w-32 h-6 bg-linear-to-b from-gray-700 to-gray-800 rounded-b-lg" />
                        <div className="mx-auto w-48 h-2 bg-gray-800 rounded-full" />
                    </div>
                </motion.div>
            </div>

        </motion.div>
    );
};