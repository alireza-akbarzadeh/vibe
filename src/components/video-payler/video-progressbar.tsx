import { motion } from "framer-motion";

interface VideoProgressbar {
    progress?: string
}
export function VideoProgressbar(props: VideoProgressbar) {
    const { progress = "90%" } = props
    return (
        <div className="relative h-1 bg-white/20 rounded-full overflow-hidden mb-3">
            <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: progress }}
                viewport={{ once: true }}
                transition={{
                    delay: 0.5,
                    duration: 1.5,
                    ease: "easeOut",
                }}
                className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
            />
        </div>
    )
}
