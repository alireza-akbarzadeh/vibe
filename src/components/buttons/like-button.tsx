import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Size } from '../play-button'
import { Button } from '../ui/button'

//TODO: animation effect 
interface LikeButtonProps {
    className?: string
    iconSize?: Size
}

export function LikeButton(props: LikeButtonProps) {
    const { className } = props

    const mapSized: Record<Size, string> = {
        "x-small": "size-4!",
        "small": "size-5!",
        "medium": "size-6!",
        "large": "size-8!",
        "extra-large": "size-10!",
    }

    return (
        <Button
            size="lg"
            variant="ghost"
            className={cn("bg-white/5 hover:bg-white/10 text-white rounded-full", className)}
        >
            <Heart className={cn(mapSized)} />
        </Button>
    )
}
