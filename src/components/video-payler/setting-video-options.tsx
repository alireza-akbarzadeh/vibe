import {
	Check,
	Gauge,
	Monitor,
	PictureInPicture,
	RotateCw,
	Settings,
	Subtitles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const QUALITY_OPTIONS = ["1080p", "720p", "480p", "360p", "Auto"];
const SUBTITLE_OPTIONS = ["Off", "English", "Persian", "French"];
const SPEED_OPTIONS = [
	{ label: "0.5x", value: 0.5 },
	{ label: "Normal", value: 1 },
	{ label: "1.25x", value: 1.25 },
	{ label: "1.5x", value: 1.5 },
	{ label: "2.0x", value: 2 },
];

interface SettingSheetProps {
	videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function SettingVideoOptions({ videoRef }: SettingSheetProps) {
	const [quality, setQuality] = useState("1080p");
	const [subtitles, setSubtitles] = useState("Off");
	const [currentSpeed, setCurrentSpeed] = useState(1);
	const [isLooping, setIsLooping] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		const sync = () => {
			setCurrentSpeed(video.playbackRate);
			setIsLooping(video.loop);
		};
		video.addEventListener("ratechange", sync);
		sync();
		return () => video.removeEventListener("ratechange", sync);
	}, [videoRef]);

	const handleSpeedChange = (val: number) => {
		if (videoRef.current) videoRef.current.playbackRate = val;
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9 text-white hover:bg-white/20"
				>
					<Settings className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-80 bg-black/40 backdrop-blur-xl border-l-white/10 text-white p-0 overflow-y-auto no-scrollbar"
			>
				<SheetHeader className="p-6 border-b border-white/10">
					<SheetTitle className="text-white flex items-center gap-2">
						<Settings className="h-5 w-5 text-purple-500" />
						Playback Settings
					</SheetTitle>
				</SheetHeader>

				<div className="p-6 space-y-8">
					{/* SPEED SECTION */}
					<section>
						<div className="flex items-center gap-2 mb-4 text-zinc-400">
							<Gauge className="h-4 w-4" />
							<span className="text-xs font-bold uppercase tracking-widest">
								Speed
							</span>
						</div>
						<div className="grid grid-cols-3 gap-2">
							{SPEED_OPTIONS.map((s) => (
								<button
									key={s.label}
									onClick={() => handleSpeedChange(s.value)}
									className={`py-2 text-xs rounded-lg border transition-all ${
										currentSpeed === s.value
											? "bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
											: "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
									}`}
								>
									{s.label}
								</button>
							))}
						</div>
					</section>

					{/* QUALITY SECTION */}
					<section>
						<div className="flex items-center gap-2 mb-4 text-zinc-400">
							<Monitor className="h-4 w-4" />
							<span className="text-xs font-bold uppercase tracking-widest">
								Quality
							</span>
						</div>
						<div className="space-y-1">
							{QUALITY_OPTIONS.map((q) => (
								<button
									key={q}
									onClick={() => setQuality(q)}
									className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
								>
									<span
										className={
											quality === q
												? "text-white"
												: "text-zinc-500 group-hover:text-zinc-300"
										}
									>
										{q}
									</span>
									{quality === q && (
										<Check className="h-4 w-4 text-purple-500" />
									)}
								</button>
							))}
						</div>
					</section>

					{/* SUBTITLES SECTION */}
					<section>
						<div className="flex items-center gap-2 mb-4 text-zinc-400">
							<Subtitles className="h-4 w-4" />
							<span className="text-xs font-bold uppercase tracking-widest">
								Subtitles
							</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{SUBTITLE_OPTIONS.map((sub) => (
								<button
									key={sub}
									onClick={() => setSubtitles(sub)}
									className={`px-4 py-2 text-xs rounded-full transition-all ${
										subtitles === sub
											? "bg-white text-black font-bold"
											: "bg-white/5 text-zinc-500 hover:text-white"
									}`}
								>
									{sub}
								</button>
							))}
						</div>
					</section>

					<Separator className="bg-white/10" />

					{/* TOGGLES */}
					<div className="space-y-4">
						<button
							onClick={() => {
								if (videoRef.current) videoRef.current.loop = !isLooping;
								setIsLooping(!isLooping);
							}}
							className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-zinc-300"
						>
							<RotateCw
								className={`h-5 w-5 ${isLooping ? "text-purple-500" : ""}`}
							/>
							<span className="flex-1 text-left">Loop Video</span>
							<div
								className={`w-8 h-4 rounded-full relative transition-colors ${isLooping ? "bg-purple-600" : "bg-zinc-700"}`}
							>
								<div
									className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isLooping ? "right-1" : "left-1"}`}
								/>
							</div>
						</button>

						<button
							onClick={() => videoRef.current?.requestPictureInPicture()}
							className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-zinc-300"
						>
							<PictureInPicture className="h-5 w-5" />
							<span className="flex-1 text-left">Picture in Picture</span>
						</button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
