import { useCallback, useEffect, useState } from "react";

export function useVideoController(
	videoRef: React.RefObject<HTMLVideoElement | null>,
	_videoId: string,
) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isWaiting, setIsWaiting] = useState(false);
	const [buffered, setBuffered] = useState(0);

	// Sync function to catch data if it's already loaded
	const syncVideoState = useCallback(() => {
		const video = videoRef.current;
		if (!video) return;

		if (video.duration) setDuration(video.duration);
		setCurrentTime(video.currentTime);
		setIsPlaying(!video.paused);
	}, [videoRef]);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		// Initial sync
		syncVideoState();

		const onLoadedMetadata = () => setDuration(video.duration);
		const onTimeUpdate = () => setCurrentTime(video.currentTime);
		const onPlay = () => setIsPlaying(true);
		const onPause = () => setIsPlaying(false);
		const onWaiting = () => setIsWaiting(true);
		const onPlaying = () => setIsWaiting(false);

		const onProgress = () => {
			if (video.buffered.length > 0 && video.duration > 0) {
				const lastBuffered = video.buffered.end(video.buffered.length - 1);
				setBuffered((lastBuffered / video.duration) * 100);
			}
		};

		video.addEventListener("loadedmetadata", onLoadedMetadata);
		video.addEventListener("timeupdate", onTimeUpdate);
		video.addEventListener("play", onPlay);
		video.addEventListener("pause", onPause);
		video.addEventListener("waiting", onWaiting);
		video.addEventListener("playing", onPlaying);
		video.addEventListener("progress", onProgress);
		// Force a check for duration immediately in case metadata is already there
		if (video.readyState >= 1) onLoadedMetadata();

		return () => {
			video.removeEventListener("loadedmetadata", onLoadedMetadata);
			video.removeEventListener("timeupdate", onTimeUpdate);
			video.removeEventListener("play", onPlay);
			video.removeEventListener("pause", onPause);
			video.removeEventListener("waiting", onWaiting);
			video.removeEventListener("playing", onPlaying);
			video.removeEventListener("progress", onProgress);
		};
	}, [videoRef, syncVideoState]);

	const togglePlay = () => {
		if (!videoRef.current) return;
		if (videoRef.current.paused) {
			videoRef.current.play();
		} else {
			videoRef.current.pause();
		}
	};

	const skip = (seconds: number) => {
		if (videoRef.current) videoRef.current.currentTime += seconds;
	};

	return {
		isPlaying,
		currentTime,
		duration,
		buffered,
		isWaiting,
		togglePlay,
		skip,
	};
}
