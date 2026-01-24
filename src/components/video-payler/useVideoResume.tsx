import { useEffect, useState } from "react";

// useVideoResume.ts
export function useVideoResume(videoRef: React.RefObject<HTMLVideoElement | null>, videoId: string) {
    const [resumeData, setResumeData] = useState<{ show: boolean; time: number }>({ show: false, time: 0 });

    useEffect(() => {
        const saved = localStorage.getItem(`video_progress_${videoId}`);
        if (saved && parseFloat(saved) > 10) {
            setResumeData({ show: true, time: parseFloat(saved) });
        }
    }, [videoId]);

    const handleResume = () => {
        if (videoRef.current) videoRef.current.currentTime = resumeData.time;
        setResumeData(prev => ({ ...prev, show: false }));
    };

    const handleRestart = () => setResumeData(prev => ({ ...prev, show: false }));

    return { resumeData, handleResume, handleRestart };
}