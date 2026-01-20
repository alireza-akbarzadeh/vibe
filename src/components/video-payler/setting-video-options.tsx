import {
    Check,
    ChevronRight,
    Gauge,
    Monitor,
    PictureInPicture,
    RotateCw,
    Settings,
    Subtitles,
    Volume2
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data for options
const QUALITY_OPTIONS = ['1080p', '720p', '480p', '360p', 'Auto'];
const SPEED_OPTIONS = ['0.5x', 'Normal', '1.25x', '1.5x', '2.0x'];
const SUBTITLE_OPTIONS = ['Off', 'English', 'Persian', 'French'];

export function SettingVideoOptions() {
    const [quality, setQuality] = useState('1080p');
    const [speed, setSpeed] = useState('Normal');
    const [subtitles, setSubtitles] = useState('Off');

    return (
        <DropdownMenu modal={false}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/20">
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>Player Settings</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent className="w-56 bg-black/90 text-white border-white/10" align="end" side="top">
                <DropdownMenuLabel className="text-xs text-gray-400 font-normal">Playback Settings</DropdownMenuLabel>

                {/* Quality Submenu */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer focus:bg-white/10 hover:text-white">
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>Quality</span>
                        <span className="ml-auto text-xs text-gray-400">{quality}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-black/95 text-white border-white/10">
                        {QUALITY_OPTIONS.map((q) => (
                            <DropdownMenuItem
                                key={q}
                                className="cursor-pointer focus:bg-white/10"
                                onClick={() => setQuality(q)}
                            >
                                <span className="flex-1">{q}</span>
                                {quality === q && <Check className="h-4 w-4 text-blue-500" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Playback Speed Submenu */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer focus:bg-white/10">
                        <Gauge className="mr-2 h-4 w-4" />
                        <span>Speed</span>
                        <span className="ml-auto text-xs text-gray-400">{speed}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-black/95 text-white border-white/10">
                        {SPEED_OPTIONS.map((s) => (
                            <DropdownMenuItem
                                key={s}
                                className="cursor-pointer focus:bg-white/10"
                                onClick={() => setSpeed(s)}
                            >
                                <span className="flex-1">{s}</span>
                                {speed === s && <Check className="h-4 w-4 text-blue-500" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Subtitles Submenu */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer focus:bg-white/10">
                        <Subtitles className="mr-2 h-4 w-4" />
                        <span>Subtitles</span>
                        <span className="ml-auto text-xs text-gray-400">{subtitles}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-black/95 text-white border-white/10">
                        {SUBTITLE_OPTIONS.map((sub) => (
                            <DropdownMenuItem
                                key={sub}
                                className="cursor-pointer focus:bg-white/10"
                                onClick={() => setSubtitles(sub)}
                            >
                                <span className="flex-1">{sub}</span>
                                {subtitles === sub && <Check className="h-4 w-4 text-blue-500" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator className="bg-white/10" />

                {/* Advanced Options */}
                <DropdownMenuItem className="cursor-pointer focus:bg-white/10">
                    <RotateCw className="mr-2 h-4 w-4" />
                    <span>Loop</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer focus:bg-white/10">
                    <PictureInPicture className="mr-2 h-4 w-4" />
                    <span>Picture in Picture</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer focus:bg-white/10">
                    <Volume2 className="mr-2 h-4 w-4" />
                    <span>Audio Boost</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}