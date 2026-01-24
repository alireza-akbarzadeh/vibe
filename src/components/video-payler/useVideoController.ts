// useVideoController.ts
export function useVideoController(
	videoRef: React.RefObject<HTMLVideoElement | null>,
	videoId: string,
) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isWaiting, setIsWaiting] = useState(false);
	const [buffered, setBuffered] = useState(0);

	// HUD States
	const [speedHUD, setSpeedHUD] = useState({ show: false, value: 1 });
	const [volumeHUD, setVolumeHUD] = useState({ show: false, value: 1 });

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const updateTime = () => setCurrentTime(video.currentTime);
		const updateProgress = () => {
			if (video.buffered.length > 0 && video.duration > 0) {
				setBuffered(
					(video.buffered.end(video.buffered.length - 1) / video.duration) *
						100,
				);
			}
		};
		const handleRate = () => {
			setSpeedHUD({ show: true, value: video.playbackRate });
			setTimeout(() => setSpeedHUD((prev) => ({ ...prev, show: false })), 1500);
		};
		const handleVol = () => {
			setVolumeHUD({ show: true, value: video.volume });
			setTimeout(
				() => setVolumeHUD((prev) => ({ ...prev, show: false })),
				1500,
			);
		};

		video.addEventListener("timeupdate", updateTime);
		video.addEventListener("progress", updateProgress);
		video.addEventListener("ratechange", handleRate);
		video.addEventListener("volumechange", handleVol);
		video.addEventListener("waiting", () => setIsWaiting(true));
		video.addEventListener("playing", () => setIsWaiting(false));
		video.addEventListener("loadedmetadata", () => setDuration(video.duration));

		return () => {
			video.removeEventListener("timeupdate", updateTime);
			video.removeEventListener("progress", updateProgress);
			// ... remove other listeners
		};
	}, [videoRef]);

	const togglePlay = () =>
		isPlaying ? videoRef.current?.pause() : videoRef.current?.play();
	const skip = (seconds: number) => {
		if (videoRef.current) videoRef.current.currentTime += seconds;
	};

	return {
		isPlaying,
		currentTime,
		duration,
		buffered,
		isWaiting,
		speedHUD,
		volumeHUD,
		togglePlay,
		skip,
	};
}
