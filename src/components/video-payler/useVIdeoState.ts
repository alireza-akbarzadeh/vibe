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

		const onPlay = () => setIsPlaying(true);
		const onPause = () => setIsPlaying(false);
		const onTimeUpdate = () => setCurrentTime(video.currentTime);
		const onLoadedMetadata = () => setDuration(video.duration);
		const onVolumeChange = () => {
			setVolume(video.volume);
			setMuted(video.muted);
		};

		video.addEventListener("play", onPlay);
		video.addEventListener("pause", onPause);
		video.addEventListener("timeupdate", onTimeUpdate);
		video.addEventListener("loadedmetadata", onLoadedMetadata);
		video.addEventListener("volumechange", onVolumeChange);

		return () => {
			video.removeEventListener("play", onPlay);
			video.removeEventListener("pause", onPause);
			video.removeEventListener("timeupdate", onTimeUpdate);
			video.removeEventListener("loadedmetadata", onLoadedMetadata);
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
