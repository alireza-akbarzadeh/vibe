import { useEffect, useState } from "react";

export function useVideoState(ref: React.RefObject<HTMLVideoElement | null>) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [muted, setMuted] = useState(false);

	useEffect(() => {
		const video = ref.current;
		if (!video) return;

		// 🔥 FORCE metadata
		video.preload = "metadata";

		const resolveDuration = () => {
			// normal case
			if (
				!Number.isNaN(video.duration) &&
				video.duration > 0 &&
				video.duration !== Infinity
			) {
				setDuration(video.duration);
				return;
			}

			// 🔥 SAFARI / STREAMING fallback
			if (video.seekable && video.seekable.length > 0) {
				const end = video.seekable.end(video.seekable.length - 1);
				if (end > 0 && !Number.isNaN(end)) {
					setDuration(end);
				}
			}
		};

		const onPlay = () => setIsPlaying(true);
		const onPause = () => setIsPlaying(false);
		const onTimeUpdate = () => {
			setCurrentTime(video.currentTime);
			// duration might resolve only AFTER playback starts
			resolveDuration();
		};

		const onVolumeChange = () => {
			setVolume(video.volume);
			setMuted(video.muted);
		};

		video.addEventListener("play", onPlay);
		video.addEventListener("pause", onPause);
		video.addEventListener("timeupdate", onTimeUpdate);

		video.addEventListener("loadedmetadata", resolveDuration);
		video.addEventListener("loadeddata", resolveDuration);
		video.addEventListener("durationchange", resolveDuration);
		video.addEventListener("canplay", resolveDuration);
		video.addEventListener("progress", resolveDuration);

		video.addEventListener("volumechange", onVolumeChange);

		// 🔥 try immediately
		resolveDuration();

		return () => {
			video.removeEventListener("play", onPlay);
			video.removeEventListener("pause", onPause);
			video.removeEventListener("timeupdate", onTimeUpdate);

			video.removeEventListener("loadedmetadata", resolveDuration);
			video.removeEventListener("loadeddata", resolveDuration);
			video.removeEventListener("durationchange", resolveDuration);
			video.removeEventListener("canplay", resolveDuration);
			video.removeEventListener("progress", resolveDuration);

			video.removeEventListener("volumechange", onVolumeChange);
		};
	}, [ref]);

	return {
		isPlaying,
		currentTime,
		duration,
		volume,
		muted,
		setIsPlaying,
	};
}
