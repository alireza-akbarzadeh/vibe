import { RotateCcw, RotateCw } from "lucide-react"; // Import new icons
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui
import BackButton from "../back-button";
import { PlayButton } from "../play-button";
import { MoreEpisode } from "./more-episode";
import { MoreVideoOptions } from "./more-video-options";
import { SoundControls } from "./SoundControls";
import { SettingVideoOptions } from "./setting-video-options";
import { VideoProgressbar } from "./video-progressbar";

interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
}

interface PlayerActions {
    togglePlay: () => void;
    skip: (seconds: number) => void;
}

interface PlayerControlsProps {
    isHovered: boolean;
    videoName: string;
    year: string;
    state: PlayerState;
    actions: PlayerActions;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function PlayerControls({
    isHovered,
    videoName,
    year,
    state,
    actions,
    videoRef
}: PlayerControlsProps) {

    const formatTime = (seconds: number) => {
        if (!seconds) return "0:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

            {/* TOP BAR */}
            <div className="p-6 flex justify-between items-start z-20">
                <BackButton title={videoName} />
                <div className="flex gap-2">
                    <MoreEpisode />
                    <SettingVideoOptions />
                </div>
            </div>

            {/* MIDDLE: PLAYBACK CONTROLS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-10 md:gap-60 z-20">
                {/* 10s Backward */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full size-20 transition-transform active:scale-90"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents triggering the overlay play/pause
                        actions.skip(-10);
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        <RotateCcw className="size-20" />
                        <span className="absolute text-[9px] font-bold mt-1">10</span>
                    </div>
                </Button>

                {/* Big Play Button */}
                <PlayButton value={state.isPlaying} onOpenChange={actions.togglePlay} />

                {/* 10s Forward */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full w-14 h-14 transition-transform active:scale-90"
                    onClick={(e) => {
                        e.stopPropagation();
                        actions.skip(10);
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        <RotateCw className="size-20" />
                        <span className="absolute text-[9px] font-bold mt-1">10</span>
                    </div>
                </Button>
            </div>

            {/* BOTTOM BAR */}
            <div className="absolute bottom-0 inset-x-0 p-8 bg-linear-to-t from-black/90 via-black/40 to-transparent z-20">
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{videoName}</h2>
                        <p className="text-white/60 text-sm font-medium">{year} • Action</p>
                    </div>

                    <VideoProgressbar
                        currentTime={state.currentTime}
                        duration={state.duration}
                        isPlaying={state.isPlaying}
                        onSeek={(t) => { if (videoRef.current) videoRef.current.currentTime = t }}
                        onPause={() => videoRef.current?.pause()}
                        onPlay={() => videoRef.current?.play()}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <SoundControls videoRef={videoRef} />
                            <span className="text-sm font-mono text-white/80 tabular-nums">
                                {formatTime(state.currentTime)} <span className="text-white/30 mx-1">/</span> {formatTime(state.duration)}
                            </span>
                        </div>
                        <MoreVideoOptions videoRef={videoRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}