import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { webSocketService } from "@/services/websocket";

interface User {
	id: string;
	name: string;
	image: string | null;
	user?: User;
}

export function WatchTogetherAvatars() {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const { auth } = useRouteContext({ from: "__root__" });
	const user = auth?.user;

	useEffect(() => {
		if (typeof window === "undefined") return;
		const params = new URLSearchParams(window.location.search);
		const together = params.get("together");
		if (together) setSessionId(together);
	}, []);

	useEffect(() => {
		if (!sessionId) return;

		const handleUserJoined = (user: User) => {
			setUsers((u) => [...u, user]);
		};

		const handleUserLeft = ({ id }: { id: string }) => {
			setUsers((u) => u.filter((x) => x.id !== id));
		};

		webSocketService.on("user-joined", handleUserJoined);
		webSocketService.on("user-left", handleUserLeft);

		webSocketService.send("join-room", {
			roomId: sessionId,
			user: user
				? {
						id: user.id,
						name: user.name || user.email?.split("@")[0] || "User",
						image: user.image || null,
					}
				: { name: "User" },
		});

		return () => {
			webSocketService.off("user-joined", handleUserJoined);
			webSocketService.off("user-left", handleUserLeft);
		};
	}, [sessionId, user]);

	if (!sessionId || users.length === 0) return null;
	const maxAvatars = 5;
	const shown = users.slice(0, maxAvatars);
	const extra = users.length - maxAvatars;
	return (
		<div className="flex items-center gap-1 ml-2">
			{shown.map((u, i) => (
				<img
					key={u.id || i}
					src={
						u.user?.image ||
						`https://avatar.vercel.sh/${encodeURIComponent(
							u.user?.name || "u",
						)}`
					}
					alt={u.user?.name || "User"}
					className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0"
				/>
			))}
			{extra > 0 && (
				<span className="w-6 h-6 rounded-full bg-zinc-700 text-white text-xs flex items-center justify-center border-2 border-white -ml-2">
					+{extra}
				</span>
			)}
		</div>
	);
}
