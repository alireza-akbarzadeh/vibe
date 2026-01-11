
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Size } from '../play-button'
import { Button, type ButtonProps } from '../ui/button'

//TODO: animation effect 
interface AddButtonProps extends ButtonProps {
    className?: string
    iconSize?: Size

}
export function AddButton(props: AddButtonProps) {
    const { className, iconSize = "small", variant = 'text', ...buttonProps } = props
    const [isChecked, setIsChecked] = useState<boolean>(false)

    const mapSized: Record<Size, string> = {
        "x-small": "size-4!",
        "small": "size-5!",
        "medium": "size-6!",
        "large": "size-8!",
        "extra-large": "size-10!",
    }
    return (
        <Button
            onClick={() => setIsChecked((prev) => !prev)}
            variant={variant}
            className={cn("w-10 h-10 p-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-lg group",
                isChecked && "bg-green-400/10  hover:bg-green-400/20 border border-green-400/20", className)

            }
            {...buttonProps}
        >
            {isChecked ? (
                <Check className={cn(" text-white  transition-all", isChecked && "text-green-400", mapSized[iconSize])} />
            ) : (
                <Plus className={cn(" text-white group-hover:rotate-90 transition-transform", mapSized[iconSize])} />
            )}
        </Button>
    )
}
