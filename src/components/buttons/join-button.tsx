import { motion } from "framer-motion";
import {
    ChevronRight
} from "lucide-react";


export function JoinButton() {

    return (
        <div className="relative flex items-center justify-center w-4 h-4 overflow-hidden" >
            <motion.div
                variants={{
                    initial: { x: -2, opacity: 1 },
                    animate: {
                        x: [-2, 12],
                        opacity: [1, 0]
                    },
                    hover: {
                        x: [-2, 12],
                        opacity: [1, 0]
                    }
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeIn",
                    repeatDelay: 0.2
                }}
                className="absolute"
            >
                <ChevronRight className="size-4 stroke-[3px]" />
            </motion.div>

            {/* A second chevron that follows to create a "continuous" stream */}
            <motion.div
                variants={{
                    initial: { x: -16, opacity: 0 },
                    animate: {
                        x: [-16, -2],
                        opacity: [0, 1]
                    },
                    hover: {
                        x: [-16, -2],
                        opacity: [0, 1]
                    }
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeOut",
                    repeatDelay: 0.2
                }}
                className="absolute"
            >
                <ChevronRight className="size-4 stroke-[3px]" />
            </motion.div>
        </div>
    );
}