import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Maximize2, Music2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useReelInteractions } from "../hooks/use-reel-interactions";
import { useVideoPlayer } from "../hooks/use-reel-player";
import {
	reelsStore,
	setIsPressing,
	setMoreMenuVideo,
	toggleFocusVideo,
	toggleFollow,
} from "../reels.store";
import type { VideoReel } from "../reels.types";
import { ReelMoreMenu } from "./reel-more-menu";
import { SidebarActions } from "./reel-sidebar-action";

interface VideoCardProps {
	video: VideoReel;
	isActive: boolean;
	onVideoEnd: () => void;
}

export function VideoCard({ video, isActive, onVideoEnd }: VideoCardProps) {
	const { isMuted, isPressing, focusedVideoId, showHeartId, moreMenuVideoId } =
		useStore(reelsStore);

	const isFocused = focusedVideoId === video.id;
	const isShowingHeart = showHeartId === video.id;
	const isMenuOpen = moreMenuVideoId === video.id;

	const { videoRef, progress, togglePlayPause } = useVideoPlayer(isActive);
	const { toggleLike, toggleSave } = useReelInteractions(video);

	const pressTimer = React.useRef<NodeJS.Timeout | null>(null);
	const clickTimer = React.useRef<NodeJS.Timeout | null>(null);

	// --- AUTO-ADVANCE LOGIC ---
	React.useEffect(() => {
		const videoEl = videoRef.current;
		if (!videoEl || !isActive) return;

		const handleEnded = () => {
			// If the video is "focused" (fullscreen mode), we usually want it to loop
			if (isFocused) {
				videoEl.currentTime = 0;
				videoEl.play().catch(() => {});
			} else if (!isPressing) {
				// Otherwise, call the prop to go to the next slide
				onVideoEnd();
			}
		};

		videoEl.addEventListener("ended", handleEnded);
		return () => videoEl.removeEventListener("ended", handleEnded);
	}, [isActive, isFocused, isPressing, onVideoEnd, videoRef]);

	// --- INTERACTION HANDLERS ---
	const handlePointerDown = (e: React.PointerEvent) => {
		if ((e.target as HTMLElement).closest(".no-pause")) return;
		pressTimer.current = setTimeout(() => {
			setIsPressing(true);
			videoRef.current?.pause();
		}, 200);
	};

	const handlePointerUp = () => {
		if (pressTimer.current) clearTimeout(pressTimer.current);
		if (isPressing) {
			setIsPressing(false);
			if (isActive) videoRef.current?.play().catch(() => {});
		}
	};

	const handleSingleClick = () => {
		if (isPressing) return;
		if (clickTimer.current) {
			clearTimeout(clickTimer.current);
			clickTimer.current = null;
			return;
		}
		clickTimer.current = setTimeout(() => {
			togglePlayPause();
			clickTimer.current = null;
		}, 250);
	};

	const handleDoubleClick = (_e: React.MouseEvent) => {
		if (clickTimer.current) {
			clearTimeout(clickTimer.current);
			clickTimer.current = null;
		}
		toggleLike();
	};

	const handleSeek = (
		e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
	) => {
		if (!videoRef.current) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const clientX =
			"touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
		const percentage = Math.max(
			0,
			Math.min(1, (clientX - rect.left) / rect.width),
		);
		videoRef.current.currentTime = percentage * videoRef.current.duration;
	};

	return (
		<div
			className="relative h-full w-full bg-black overflow-hidden"
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerUp}
		>
			<video
				ref={videoRef}
				src={video.videoUrl}
				poster={video.thumbnail}
				className={cn(
					"absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out cursor-pointer",
					isPressing ? "scale-[0.98] brightness-75" : "scale-100",
					isFocused ? "scale-105" : "scale-100",
				)}
				playsInline
				muted={isMuted}
				onClick={handleSingleClick}
				onDoubleClick={handleDoubleClick}
			/>

			<div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />

			<AnimatePresence>
				{isFocused && (
					<motion.button
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						onClick={(e) => {
							e.stopPropagation();
							toggleFocusVideo(null);
						}}
						className="no-pause absolute top-14 left-6 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold uppercase"
					>
						<Maximize2 className="size-4 rotate-180" />
						Exit Full Size
					</motion.button>
				)}
			</AnimatePresence>

			<div
				className={cn(
					"absolute bottom-14 left-4 right-20 z-20 transition-all duration-500 ease-in-out",
					isPressing || isFocused
						? "opacity-0 translate-y-10 pointer-events-none"
						: "opacity-100 translate-y-0",
				)}
			>
				<div className="flex items-center gap-3 mb-4">
					<button
						onClick={(e) => {
							e.stopPropagation();
							toggleFollow(video.user.username);
						}}
						className="relative no-pause"
					>
						<img
							src={video.user.avatar}
							className="size-11 rounded-full border-2 border-white object-cover shadow-xl"
							alt=""
						/>
						{!video.user.isFollowing && (
							<div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-pink-500 flex items-center justify-center border-2 border-black text-white text-[10px] font-black">
								+
							</div>
						)}
					</button>
					<span className="text-white font-bold text-sm tracking-wide drop-shadow-lg">
						@{video.user.username}
					</span>
				</div>
				<p className="mb-4 text-white/95 text-sm font-medium line-clamp-2 leading-snug drop-shadow-md max-w-[90%]">
					{video.caption}
				</p>
				<div className="flex items-center gap-2 text-white/80">
					<Music2 className="size-3.5 animate-pulse" />
					<div className="overflow-hidden w-48">
						<motion.p
							animate={{ x: [0, -150] }}
							transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
							className="text-[11px] font-bold uppercase whitespace-nowrap tracking-wider"
						>
							{video.soundName} • Original Audio
						</motion.p>
					</div>
				</div>
			</div>

			<div
				className={cn(
					"no-pause absolute right-2 bottom-20 z-30 transition-opacity duration-300",
					isPressing ? "opacity-0" : "opacity-100",
				)}
			>
				<SidebarActions
					video={video}
					onMore={() => setMoreMenuVideo(video.id)}
					isFocused={isFocused}
					onToggleFocus={() => toggleFocusVideo(video.id)}
					onLike={toggleLike}
					onSave={toggleSave}
				/>
			</div>

			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className={cn(
					"no-pause hidden absolute bottom-0 left-0 right-0 h-8 md:flex items-end cursor-pointer z-50 transition-opacity",
					isFocused ? "opacity-0" : "opacity-100",
				)}
				onClick={(e) => {
					e.stopPropagation();
					handleSeek(e);
				}}
			>
				<div className="w-full h-1 bg-white/20 group-hover:h-2 transition-all relative">
					<motion.div
						className="h-full bg-linear-to-r from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(192,38,211,0.6)] relative"
						style={{ width: `${progress}%` }}
					>
						<div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg" />
					</motion.div>
				</div>
			</div>
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className={cn(
					"no-pause flex absolute bottom-0 left-0 right-0  items-end cursor-pointer z-50 transition-opacity",
					isFocused ? "opacity-0" : "opacity-100",
				)}
				onClick={(e) => {
					e.stopPropagation();
					handleSeek(e);
				}}
			>
				<div className="w-full h-1 bg-white/20 group-hover:h-2 transition-all relative">
					<motion.div
						className="h-full bg-linear-to-r from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(192,38,211,0.6)] relative"
						style={{ width: `${progress}%` }}
					>
						<div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg" />
					</motion.div>
					asdasdasd
				</div>
			</div>
			<AnimatePresence>
				{isShowingHeart && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1.5, opacity: 1 }}
						exit={{ scale: 2, opacity: 0 }}
						className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
					>
						<Heart className="size-32 text-white fill-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
					</motion.div>
				)}
			</AnimatePresence>
			<ReelMoreMenu
				isOpen={isMenuOpen}
				onClose={() => setMoreMenuVideo(null)}
				onAction={() => {}}
			/>
		</div>
	);
}
