/** biome-ignore-all lint/a11y/useKeyWithClickEvents: The click events are handled by the slider component. */

import { useStore } from "@tanstack/react-store";
import {
	Check,
	ChevronDown,
	ChevronRight,
	Download,
	ListMusic,
	Mic2,
	MoreHorizontal,
	Music,
	Pause,
	Pin,
	Play,
	Radio,
	Share2,
	SkipBack,
	SkipForward,
	Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LikeButton } from "@/components/buttons/like-button";
import { AnimatePresence, motion, useAnimation } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { musicAction, musicStore } from "../music.store";
import { AddToPlaylistModal } from "./add-playlist";

export function MobilePlayer() {
	const [isOpen, setIsOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const controls = useAnimation();

	const store = useStore(musicStore);
	const {
		currentSong,
		isPlaying,
		progressPercentage,
		currentTime,
		showLyrics,
		queue,
		library,
	} = store;

	// --- SHARE FUNCTIONALITY ---
	const handleShare = async () => {
		if (!currentSong) return;

		const shareData = {
			title: currentSong.title,
			text: `Check out ${currentSong.title} by ${currentSong.artist}`,
			url: window.location.href,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				await navigator.clipboard.writeText(window.location.href);
				alert("Link copied to clipboard!");
			}
		} catch (err) {
			console.error("Error sharing:", err);
		}
	};

	// --- DOWNLOAD FUNCTIONALITY ---
	const handleDownload = () => {
		if (!currentSong) return;

		// In a real app, this would be the actual download URL
		const downloadUrl = `https://api.musicapp.com/download/${currentSong.id}`;
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = `${currentSong.title} - ${currentSong.artist}.mp3`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Show toast or feedback
		console.log(`Downloading: ${currentSong.title}`);
	};

	// --- SONG RADIO FUNCTIONALITY ---
	const handleGoToSongRadio = () => {
		if (!currentSong) return;

		// Create a radio based on current song
		const radioSongs = [
			{ ...currentSong, id: Math.random() * 1000, title: "Similar Song 1" },
			{ ...currentSong, id: Math.random() * 1000, title: "Similar Song 2" },
			{ ...currentSong, id: Math.random() * 1000, title: "Similar Song 3" },
		];

		// In a real app, you would fetch similar songs
		console.log(`Creating radio for: ${currentSong.title}`);

		// Open radio view or update queue
		musicStore.setState((s) => ({
			...s,
			queue: [...radioSongs],
			showQueue: true,
		}));
	};

	// --- REMOVE FROM QUEUE FUNCTIONALITY ---
	const handleRemoveFromQueue = () => {
		if (!currentSong) return;

		musicStore.setState((s) => ({
			...s,
			queue: s.queue.filter((song) => song.id !== currentSong.id),
		}));

		console.log(`Removed ${currentSong.title} from queue`);
	};

	// --- PIN/UNPIN FUNCTIONALITY ---
	const handleTogglePin = () => {
		if (!currentSong) return;

		// Find if the album exists in library
		const albumInLibrary = library.find(
			(item) => item.title === currentSong.album && item.type === "playlist",
		);

		if (albumInLibrary) {
			// Toggle pin for the album
			musicAction.togglePin(albumInLibrary.id);
		} else {
			// Create a new playlist for the album and pin it
			const newPlaylist = {
				id: `album_${currentSong.album.replace(/\s+/g, "_").toLowerCase()}`,
				title: currentSong.album,
				subtitle: `Album • ${currentSong.artist}`,
				type: "playlist" as const,
				image: currentSong.albumArt,
				isPinned: true,
				isLiked: false,
			};

			musicStore.setState((s) => ({
				...s,
				library: [newPlaylist, ...s.library],
			}));
		}

		console.log(
			`${currentSong.album} ${albumInLibrary?.isPinned ? "unpinned" : "pinned"}`,
		);
	};

	// --- VIEW LYRICS FUNCTIONALITY ---
	const handleViewLyrics = () => {
		musicAction.toggleLyrics();
		console.log("Lyrics toggled");
	};

	// --- VIEW QUEUE FUNCTIONALITY ---
	const handleViewQueue = () => {
		musicAction.toggleQueue(currentSong.id);
	};

	// --- DRAG / SEEK LOGIC ---
	const handleSeek = useCallback(
		(e: React.MouseEvent | React.TouchEvent | PointerEvent) => {
			if (!progressBarRef.current || !currentSong) return;
			const rect = progressBarRef.current.getBoundingClientRect();
			const clientX =
				"touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
			const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
			musicAction.updateCurrentTime(Math.floor(p * currentSong.duration));
		},
		[currentSong],
	);

	const onPointerDown = (e: React.PointerEvent) => {
		e.stopPropagation();
		setIsDragging(true);
		handleSeek(e);

		const onPointerMove = (moveEvent: PointerEvent) => {
			handleSeek(moveEvent);
		};

		const onPointerUp = () => {
			setIsDragging(false);
			document.removeEventListener("pointermove", onPointerMove);
			document.removeEventListener("pointerup", onPointerUp);
		};

		document.addEventListener("pointermove", onPointerMove);
		document.addEventListener("pointerup", onPointerUp);
	};

	// --- ANIMATION & TICKER ---
	useEffect(() => {
		controls.start({
			scale: isPlaying ? 1 : 0.85,
			transition: { type: "spring", stiffness: 260, damping: 20 },
		});
	}, [isPlaying, controls]);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;
		if (isPlaying) {
			interval = setInterval(() => {
				const latestTime = musicStore.state.currentTime;
				const latestSong = musicStore.state.currentSong;
				if (latestSong && latestTime < latestSong.duration) {
					musicAction.updateCurrentTime(latestTime + 1);
				} else {
					musicAction.skipNext();
				}
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isPlaying]);

	// Check if album is pinned
	const isAlbumPinned = library.some(
		(item) => item.title === currentSong?.album && item.isPinned,
	);

	if (!currentSong) return null;

	return (
		<>
			{/* 1. MINI PLAYER */}
			<AnimatePresence>
				{!isOpen && (
					<motion.div
						drag="y"
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={0.2}
						onDragEnd={(_, info) => {
							if (info.offset.y < -40) setIsOpen(true);
						}}
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 100, opacity: 0 }}
						onClick={() => setIsOpen(true)}
						className="h-20 px-3 flex items-center justify-between relative bg-black/90 backdrop-blur-xl border-t border-white/5 cursor-pointer z-40"
					>
						<div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50">
							<motion.div
								className="h-full bg-linear-to-r from-purple-500 to-pink-500"
								animate={{ width: `${progressPercentage}%` }}
								transition={{ ease: "linear", duration: isPlaying ? 1 : 0 }}
							/>
						</div>
						<div className="flex items-center gap-3 min-w-0 flex-1">
							<img
								src={currentSong.albumArt}
								className="w-12 h-12 rounded-lg object-cover"
								alt=""
							/>
							<div className="min-w-0 flex-1">
								<div className="text-white text-sm font-bold truncate">
									{currentSong.title}
								</div>
								<div className="text-white/60 text-xs truncate">
									{currentSong.artist}
								</div>
							</div>
						</div>
						<div
							className="flex items-center gap-1"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								onClick={musicAction.togglePlay}
								className="w-12 h-12 flex items-center justify-center"
							>
								{isPlaying ? (
									<Pause className="w-7 h-7 text-white fill-current" />
								) : (
									<Play className="w-7 h-7 text-white fill-current ml-1" />
								)}
							</button>
							<AddToPlaylistModal />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* 2. FULL SCREEN DRAWER */}
			<Drawer open={isOpen} onOpenChange={setIsOpen}>
				<DrawerContent className="h-dvh bg-[#121212] border-none p-0 outline-none">
					<div className="flex flex-col h-full px-8 pt-4 pb-12 overflow-hidden bg-linear-to-b from-[#444] to-[#121212]">
						{/* Header Section */}
						<div className="flex items-center justify-between mb-8">
							<button onClick={() => setIsOpen(false)} className="p-2 -ml-2">
								<ChevronDown className="w-8 h-8 text-white" />
							</button>
							<div className="flex flex-col items-center">
								<span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black">
									Playing From Album
								</span>
								<span className="text-xs text-white font-bold truncate max-w-50 mt-1">
									{currentSong.album}
								</span>
							</div>

							{/* --- THREE DOTS BUTTON (Dropdown) --- */}
							<Drawer>
								<DrawerTrigger asChild>
									<button className="p-2 -mr-2 outline-none group">
										<MoreHorizontal className="w-5 h-5 text-white/70 group-hover:text-white transition-all duration-200 group-hover:scale-110" />
									</button>
								</DrawerTrigger>
								<DrawerContent className="bg-linear-to-b  backdrop-blur-xl shadow-2xl">
									<div className="h-1 w-10 mx-auto mt-3 flex flex-col items-center rounded-full bg-white/20" />
									{/* Drawer Header with song info */}
									<div className="px-6 py-4 border-b border-white/10">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shadow-inner">
												<Music className="w-5 h-5 text-purple-400" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-semibold text-white truncate text-sm">
													{currentSong.title}
												</p>
												<p className="text-xs text-white/60 truncate">
													{currentSong.artist}
												</p>
											</div>
										</div>
									</div>

									{/* Menu Items Container */}
									<div className="px-3 py-4 space-y-1">
										<DrawerTrigger asChild>
											<Button
												onClick={handleGoToSongRadio}
												variant="text"
												className="w-full justify-start gap-3 px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-all duration-200 group/menu rounded-lg"
											>
												<div className="relative">
													<Radio className="w-4 h-4 text-blue-400 group-hover/menu:scale-110 transition-transform" />
													<div className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm group-hover/menu:opacity-100 opacity-0 transition-opacity" />
												</div>
												<span className="text-white text-sm font-medium">
													Go to song radio
												</span>
												<ChevronRight className="w-4 h-4 ml-auto text-white/30 group-hover/menu:text-white/60 transition-colors" />
											</Button>
										</DrawerTrigger>

										<DrawerTrigger asChild>
											<Button
												onClick={handleViewLyrics}
												variant="text"
												className="w-full justify-start gap-3 px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-all duration-200 group/menu rounded-lg"
											>
												<div className="relative">
													<Mic2 className="w-4 h-4 text-emerald-400 group-hover/menu:scale-110 transition-transform" />
													<div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-sm group-hover/menu:opacity-100 opacity-0 transition-opacity" />
												</div>
												<span className="text-white text-sm font-medium">
													{showLyrics ? "Hide lyrics" : "View lyrics"}
												</span>
												<ChevronRight className="w-4 h-4 ml-auto text-white/30 group-hover/menu:text-white/60 transition-colors" />
											</Button>
										</DrawerTrigger>

										<div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-2" />

										<DrawerTrigger asChild>
											<Button
												onClick={handleRemoveFromQueue}
												variant="ghost"
												disabled={
													queue.length === 0 ||
													!queue.some((song) => song.id === currentSong.id)
												}
												className="w-full justify-start gap-3 px-4 py-3 hover:bg-red-500/10 active:bg-red-500/20 transition-all duration-200 group/menu rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<div className="relative">
													<Trash2 className="w-4 h-4 text-red-400 group-hover/menu:scale-110 transition-transform" />
													<div className="absolute inset-0 bg-red-400/20 rounded-full blur-sm group-hover/menu:opacity-100 opacity-0 transition-opacity" />
												</div>
												<span className="text-red-400 text-sm font-medium">
													Remove from queue
												</span>
											</Button>
										</DrawerTrigger>

										<DrawerTrigger asChild>
											<Button
												onClick={handleTogglePin}
												variant="text"
												className="w-full justify-start gap-3 px-4 py-3 hover:bg-purple-500/10 active:bg-purple-500/20 transition-all duration-200 group/menu rounded-lg"
											>
												<div className="relative">
													<Pin
														className={`w-4 h-4 transition-all duration-200 group-hover/menu:scale-110 ${
															isAlbumPinned
																? "text-purple-500 fill-purple-500"
																: "text-white/60 group-hover/menu:text-purple-400"
														}`}
													/>
													<div className="absolute inset-0 bg-purple-500/20 rounded-full blur-sm group-hover/menu:opacity-100 opacity-0 transition-opacity" />
												</div>
												<span
													className={`text-sm font-medium ${
														isAlbumPinned ? "text-purple-400" : "text-white"
													}`}
												>
													{isAlbumPinned ? "Unpin album" : "Pin album"}
												</span>
												{isAlbumPinned && (
													<div className="ml-auto px-2 py-0.5 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-full">
														<Check className="w-3 h-3 text-purple-400" />
													</div>
												)}
											</Button>
										</DrawerTrigger>

										{/* Additional premium options */}
										<div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-2" />
										<DrawerTrigger asChild>
											<Button
												onClick={handleDownload}
												variant="text"
												className="w-full justify-start gap-3 px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-all duration-200 group/menu rounded-lg"
											>
												<div className="relative">
													<Download className="w-4 h-4 text-amber-400 group-hover/menu:scale-110 transition-transform" />
													<div className="absolute inset-0 bg-amber-400/20 rounded-full blur-sm group-hover/menu:opacity-100 opacity-0 transition-opacity" />
												</div>
												<span className="text-white text-sm font-medium">
													Download
												</span>
												<span className="ml-auto text-xs text-amber-400/70 bg-amber-400/10 px-2 py-0.5 rounded-full">
													PRO
												</span>
											</Button>
										</DrawerTrigger>
									</div>
								</DrawerContent>
							</Drawer>
						</div>

						<div className="flex-1 flex items-center justify-center py-4">
							<motion.img
								animate={controls}
								src={currentSong.albumArt}
								className="aspect-square w-full max-w-[320px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] object-cover"
							/>
						</div>

						<div className="mt-8 space-y-8">
							<div className="flex items-center justify-between">
								<div className="min-w-0">
									<h2 className="text-2xl font-black text-white truncate">
										{currentSong.title}
									</h2>
									<p className="text-lg text-white/60 truncate font-medium">
										{currentSong.artist}
									</p>
								</div>
								<div className="flex items-center gap-4">
									<LikeButton
										isLiked={currentSong.isLiked}
										iconSize="large"
										onClick={() => musicAction.toggleLike(currentSong)}
									/>
									<AddToPlaylistModal />
								</div>
							</div>

							{/* --- THE DRAGGABLE PROGRESS BAR --- */}
							<div className="space-y-3">
								<div
									ref={progressBarRef}
									onPointerDown={onPointerDown}
									className="h-6 flex items-center w-full group cursor-pointer touch-none relative"
								>
									<div className="h-1.5 w-full bg-white/10 rounded-full relative overflow-visible">
										<motion.div
											className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full absolute left-0 top-0"
											animate={{ width: `${progressPercentage}%` }}
											transition={{
												ease: "linear",
												duration: isDragging ? 0 : isPlaying ? 1 : 0.2,
											}}
										/>
										<motion.div
											className="absolute top-1/2 -translate-y-1/2 size-4 bg-white rounded-full shadow-xl"
											animate={{
												left: `${progressPercentage}%`,
												scale: isDragging ? 1.4 : 1,
											}}
											transition={{
												left: {
													ease: "linear",
													duration: isDragging ? 0 : isPlaying ? 1 : 0.2,
												},
												scale: { type: "spring", stiffness: 300, damping: 20 },
											}}
											style={{ x: "-50%" }}
										/>
									</div>
								</div>
								<div className="flex justify-between text-[11px] text-white/40 font-bold tabular-nums">
									<span>
										{Math.floor(currentTime / 60)}:
										{(currentTime % 60).toString().padStart(2, "0")}
									</span>
									<span>
										{Math.floor(currentSong.duration / 60)}:
										{(currentSong.duration % 60).toString().padStart(2, "0")}
									</span>
								</div>
							</div>

							{/* Main Controls */}
							<div className="flex items-center justify-between">
								{/* --- SHARE BUTTON --- */}
								<button
									onClick={handleShare}
									className="text-white/40 hover:text-white active:text-white transition-colors"
								>
									<Share2 className="w-6 h-6" />
								</button>

								<div className="flex items-center gap-8">
									<button
										onClick={musicAction.skipPrevious}
										className="text-white hover:text-white/80 transition-colors"
									>
										<SkipBack className="w-9 h-9 fill-current" />
									</button>
									<button
										onClick={musicAction.togglePlay}
										className="w-20 h-20 rounded-full bg-white hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center shadow-xl"
									>
										{isPlaying ? (
											<Pause className="w-10 h-10 text-black fill-current" />
										) : (
											<Play className="w-10 h-10 text-black fill-current ml-1" />
										)}
									</button>
									<button
										onClick={musicAction.skipNext}
										className="text-white hover:text-white/80 transition-colors"
									>
										<SkipForward className="w-9 h-9 fill-current" />
									</button>
								</div>
								<button
									onClick={handleViewQueue}
									className="text-white/40 hover:text-white active:text-white transition-colors relative"
								>
									<ListMusic className="w-6 h-6" />
									{queue.length > 0 && (
										<span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
											{queue.length}
										</span>
									)}
								</button>
							</div>
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
