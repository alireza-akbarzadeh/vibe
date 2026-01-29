import {
	Camera,
	Crop,
	Frame,
	Maximize,
	Minimize,
	MoreVertical,
	PictureInPicture,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipButton } from "../buttons/button-tooltip";

type MoreVideoOptionsProps = {
	videoRef: React.RefObject<HTMLVideoElement | null>;
};

export function MoreVideoOptions({ videoRef }: MoreVideoOptionsProps) {
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Listen for fullscreen changes
	useEffect(() => {
		const handler = () => setIsFullscreen(!!document.fullscreenElement);
		document.addEventListener("fullscreenchange", handler);
		return () => document.removeEventListener("fullscreenchange", handler);
	}, []);

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(console.error);
		} else {
			document.exitFullscreen().catch(console.error);
		}
	};

	const togglePiP = async () => {
		if (!videoRef.current) return;
		try {
			if (videoRef.current !== document.pictureInPictureElement) {
				await videoRef.current.requestPictureInPicture();
			} else {
				await document.exitPictureInPicture();
			}
		} catch (err) {
			console.error("PiP error:", err);
		}
	};

	const handleScreenshot = () => {
		if (!videoRef.current) return;
		const video = videoRef.current;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext("2d");
		ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

		const image = canvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.href = image;
		link.download = `screenshot-${Date.now()}.png`;
		link.click();
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<TooltipButton
					tooltip={{ children: "More", side: "top", align: "center" }}
					variant="text"
				>
					<MoreVertical />
				</TooltipButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" side="top" className="w-48">
				<DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
					View Options
				</DropdownMenuLabel>

				{/* Fullscreen */}
				<DropdownMenuItem onClick={toggleFullscreen}>
					{isFullscreen ? (
						<Minimize className="mr-2 h-4 w-4" />
					) : (
						<Maximize className="mr-2 h-4 w-4" />
					)}
					<span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
				</DropdownMenuItem>

				{/* Picture in Picture */}
				<DropdownMenuItem onClick={togglePiP}>
					<PictureInPicture className="mr-2 h-4 w-4" />
					<span>Picture in Picture</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
					Appearance
				</DropdownMenuLabel>

				{/* Fit to Screen */}
				<DropdownMenuItem
					onClick={() => {
						if (videoRef.current) videoRef.current.style.objectFit = "contain";
					}}
				>
					<Frame className="mr-2 h-4 w-4" />
					<span>Fit to Screen</span>
				</DropdownMenuItem>

				{/* Crop to Fill */}
				<DropdownMenuItem
					onClick={() => {
						if (videoRef.current) videoRef.current.style.objectFit = "cover";
					}}
				>
					<Crop className="mr-2 h-4 w-4" />
					<span>Crop to Fill</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				{/* Screenshot */}
				<DropdownMenuItem onClick={handleScreenshot}>
					<Camera className="mr-2 h-4 w-4" />
					<span>Screenshot</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
