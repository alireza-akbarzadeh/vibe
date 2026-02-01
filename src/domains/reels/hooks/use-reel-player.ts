import { useEffect, useRef, useState } from "react";

export function useVideoPlayer(isActive: boolean) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const el = videoRef.current;
		if (!el) return;

		if (isActive) {
			el.currentTime = 0;
			el.play()
				.then(() => setIsPlaying(true))
				.catch(() => {});
		} else {
			el.pause();
			el.currentTime = 0;
			setIsPlaying(false);
			setProgress(0);
		}
	}, [isActive]);

	useEffect(() => {
		const el = videoRef.current;
		if (!el) return;

		const handleTimeUpdate = () => {
			setProgress((el.currentTime / el.duration) * 100);
		};

		el.addEventListener("timeupdate", handleTimeUpdate);
		return () => el.removeEventListener("timeupdate", handleTimeUpdate);
	}, []);

	const togglePlayPause = () => {
		if (!videoRef.current) return;
		if (isPlaying) videoRef.current.pause();
		else videoRef.current.play();
		setIsPlaying(!isPlaying);
	};

	return { videoRef, isPlaying, progress, togglePlayPause };
}
