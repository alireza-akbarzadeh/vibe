import { AppWindowMac, Settings } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { TooltipButton } from '../buttons/button-tooltip'


export function SettingVideoOptions() {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <TooltipButton tooltip={{ children: "setting", side: "top", align: "center" }} variant='text'>
                    <Settings />
                </TooltipButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center'>
                <DropdownMenuItem >
                    <AppWindowMac className='' />
                    Full size
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
