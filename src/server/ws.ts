import { WebSocket, WebSocketServer } from "ws";

interface PlaybackState {
	time: number;
	playing: boolean;
}

interface User {
	id: string;
	name: string;
	image: string | null;
}

const roomStates: Map<string, PlaybackState> = new Map();
const roomClients: Map<string, Set<WebSocket>> = new Map();
const roomUsers: Map<string, Set<User>> = new Map();
const clientUsers: Map<WebSocket, User> = new Map();

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws, req) => {
	if (!req.url) {
		ws.close();
		return;
	}
	const url = new URL(req.url, `http://${req.headers.host}`);
	const roomId = url.searchParams.get("roomId");

	if (!roomId) {
		ws.close();
		return;
	}

	if (!roomClients.has(roomId)) {
		roomClients.set(roomId, new Set());
		roomUsers.set(roomId, new Set());
	}
	roomClients.get(roomId)?.add(ws);

	if (roomStates.has(roomId)) {
		ws.send(
			JSON.stringify({
				type: "playback-state",
				payload: roomStates.get(roomId),
			}),
		);
	}

	ws.on("message", (message) => {
		const { type, payload } = JSON.parse(message.toString());

		if (type === "playback-update") {
			roomStates.set(roomId, payload);
			roomClients.get(roomId)?.forEach((client) => {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify({ type: "playback-state", payload }));
				}
			});
		} else if (type === "join-room") {
			const user = payload.user as User;
			roomUsers.get(roomId)?.add(user);
			clientUsers.set(ws, user);
			const users = roomUsers.get(roomId);
			if (users) {
				roomClients.get(roomId)?.forEach((client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(
							JSON.stringify({
								type: "user-list",
								payload: Array.from(users),
							}),
						);
					}
				});
			}
		}
	});

	ws.on("close", () => {
		if (roomClients.has(roomId)) {
			roomClients.get(roomId)?.delete(ws);
			const user = clientUsers.get(ws);
			if (user) {
				roomUsers.get(roomId)?.delete(user);
				clientUsers.delete(ws);
				const users = roomUsers.get(roomId);
				if (users) {
					roomClients.get(roomId)?.forEach((client) => {
						if (client.readyState === WebSocket.OPEN) {
							client.send(
								JSON.stringify({
									type: "user-list",
									payload: Array.from(users),
								}),
							);
						}
					});
				}
			}
		}
	});
});

export { wss };
