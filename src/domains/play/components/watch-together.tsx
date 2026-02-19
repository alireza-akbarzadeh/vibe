import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { webSocketService } from "@/services/websocket";

interface User {
	id: string;
	name: string;
}

function generateSessionId() {
	return Math.random().toString(36).slice(2, 10);
}

export function WatchTogetherBar({ playId }: { playId: string }) {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [joined, setJoined] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [_playback, setPlayback] = useState<{ time: number; playing: boolean }>(
		{ time: 0, playing: false },
	);

	const [url, setUrl] = useState("");

	useEffect(() => {
		if (typeof window === "undefined") return;
		const params = new URLSearchParams(window.location.search);
		const together = params.get("together");
		if (together) {
			setSessionId(together);
		}
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (sessionId) {
			setUrl(`${window.location.origin}/play/${playId}?together=${sessionId}`);
		}
	}, [sessionId, playId]);

	useEffect(() => {
		if (!sessionId) return;

		const handleUserJoined = (user: User) => {
			setUsers((u) => [...u, user]);
		};

		const handleUserLeft = ({ id }: { id: string }) => {
			setUsers((u) => u.filter((x) => x.id !== id));
		};

		const handlePlaybackState = (state: { time: number; playing: boolean }) => {
			setPlayback(state);
		};

		webSocketService.on("user-joined", handleUserJoined);
		webSocketService.on("user-left", handleUserLeft);
		webSocketService.on("playback-state", handlePlaybackState);

		webSocketService.send("join-room", {
			roomId: sessionId,
			user: { name: "User" },
		});

		setJoined(true);

		return () => {
			webSocketService.off("user-joined", handleUserJoined);
			webSocketService.off("user-left", handleUserLeft);
			webSocketService.off("playback-state", handlePlaybackState);
		};
	}, [sessionId]);

	const handleCreate = () => {
		const id = generateSessionId();
		setSessionId(id);
		if (typeof window !== "undefined") {
			window.history.replaceState({}, "", `?together=${id}`);
		}
	};

	return (
		<div className="mb-4 flex flex-col md:flex-row items-center gap-3 bg-zinc-900/80 rounded-xl p-4 border border-white/10">
			{!sessionId ? (
				<Button onClick={handleCreate} variant="secondary">
					Watch Together
				</Button>
			) : (
				<div className="flex flex-col md:flex-row items-center gap-2 w-full">
					<Input value={url} readOnly className="w-full md:w-96" />
					<Button
						onClick={() => {
							if (typeof navigator !== "undefined") {
								navigator.clipboard.writeText(url);
								setCopied(true);
								setTimeout(() => setCopied(false), 1200);
							}
						}}
						variant="outline"
					>
						{copied ? "Copied!" : "Copy Link"}
					</Button>
					{joined && (
						<span className="text-xs text-muted-foreground">
							{users.length + 1} watching
						</span>
					)}
				</div>
			)}
		</div>
	);
}
