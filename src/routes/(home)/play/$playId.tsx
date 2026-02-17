import { createFileRoute } from "@tanstack/react-router";
import { VideoPlayer } from "@/components/video-payler/video-player";
import { VIDEOS } from "@/constants/media";
import { useEffect, useRef, useState } from "react";
import { getWatchTogetherSocket } from "@/lib/watch-together-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function generateSessionId() {
	return Math.random().toString(36).slice(2, 10);
}

function WatchTogetherBar({ playId }: { playId: string }) {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [joined, setJoined] = useState(false);
	const [users, setUsers] = useState<any[]>([]);
	const [playback, setPlayback] = useState<{ time: number; playing: boolean }>({ time: 0, playing: false });
	const socketRef = useRef<any>(null);

	const url = sessionId
		? `${window.location.origin}/play/${playId}?together=${sessionId}`
		: "";

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const together = params.get("together");
		if (together) {
			setSessionId(together);
		}
	}, []);

	useEffect(() => {
		if (!sessionId) return;
		const socket = getWatchTogetherSocket();
		socketRef.current = socket;
		socket.emit("join-room", { roomId: sessionId, user: { name: "User" } });
		socket.on("user-joined", (user) => setUsers((u) => [...u, user]));
		socket.on("user-left", ({ id }) => setUsers((u) => u.filter((x) => x.id !== id)));
		socket.on("playback-state", (state) => setPlayback(state));
		setJoined(true);
		return () => { socket.disconnect(); };
	}, [sessionId]);

	const handleCreate = () => {
		const id = generateSessionId();
		setSessionId(id);
		window.history.replaceState({}, "", `?together=${id}`);
	};

	return (
		<div className="mb-4 flex flex-col md:flex-row items-center gap-3 bg-zinc-900/80 rounded-xl p-4 border border-white/10">
			{!sessionId ? (
				<Button onClick={handleCreate} variant="secondary">Watch Together</Button>
			) : (
				<div className="flex flex-col md:flex-row items-center gap-2 w-full">
					<Input value={url} readOnly className="w-full md:w-96" />
					<Button
						onClick={() => {
							navigator.clipboard.writeText(url);
							setCopied(true);
							setTimeout(() => setCopied(false), 1200);
						}}
						variant="outline"
					>
						{copied ? "Copied!" : "Copy Link"}
					</Button>
					{joined && <span className="text-xs text-muted-foreground">{users.length + 1} watching</span>}
				</div>
			)}
		</div>
	);
}

export const Route = createFileRoute("/(home)/play/$playId")({
	component: RouteComponent,
});

function RouteComponent() {
	const playId = "s"; // TODO: get from params
	const videoData = {
		src: VIDEOS.demo,
		videoPoster:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop",
		year: "2014",
		totalTime: "2:49:00",
		videoName: "Interstellar",
	};
	return (
		<>
			<WatchTogetherBar playId={playId} />
			<VideoPlayer videoId={playId} {...videoData} />
		</>
	);
}
