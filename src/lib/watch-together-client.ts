import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_WATCH_TOGETHER_URL || "http://localhost:4001";

let socket: Socket | null = null;

export function getWatchTogetherSocket() {
	if (!socket) {
		socket = io(URL, { transports: ["websocket"] });
	}
	return socket;
}
