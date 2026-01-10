import { AppWindowMac, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { TooltipButton } from '../buttons/button-tooltip'


export function MoreVideoOptions() {
    return (
        <div>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <TooltipButton tooltip={{ children: "more", side: "top", align: "center" }} variant='text'>
                        <MoreVertical />
                    </TooltipButton>

                </DropdownMenuTrigger>
                <DropdownMenuContent align='center'>
                    <DropdownMenuItem >
                        <AppWindowMac className='' />
                        Full size
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
