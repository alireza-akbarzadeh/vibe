import { motion } from "framer-motion"
import { Pause, Play } from "lucide-react"
import { Button } from "./ui/button"

export type Size = "x-small" | "small" | "medium" | "large" | "extra-large"

interface PlayButtonProps {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    value: boolean
    size?: Size
}

export function PlayButton(props: PlayButtonProps) {
    const { onOpenChange, size = "medium", value } = props

    const mapSized: Record<Size, { parent: string, child: string }> = {
        "x-small": { child: "w-24 h-24", parent: "w-16 h-16 " },
        "small": { child: "w-24 h-24", parent: "w-16 h-16 " },
        "medium": { child: "w-24 h-24", parent: "w-15 h-15 " },
        "large": { child: "w-24 h-24", parent: "w-16 h-16 " },
        "extra-large": { child: "w-24 h-24", parent: "w-16 h-16 " },
    }
    return (
        <Button
            onClick={() => onOpenChange((prev) => !prev)}
            className="absolute inset-1/2 w-20 h-20 rounded-full flex items-center justify-center group"
        >
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-full bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-shadow ${mapSized[size].parent}`}
            >
                {value ?
                    <Pause className={` text-white fill-current ml-1${mapSized[size].child}`} />
                    :
                    <Play className={` text-white fill-current ml-1${mapSized[size].child}`} />
                }
            </motion.div>
        </Button>
    )
}
