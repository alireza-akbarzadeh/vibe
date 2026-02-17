import { Server } from "socket.io";
import { createServer } from "http";

// This is a minimal Socket.IO server for Watch Together sessions
const httpServer = createServer();
const io = new Server(httpServer, {
	cors: { origin: "*" },
});

// Room state: { [roomId]: { users: Set<socketId>, playback: { time, playing } } }
const rooms: Record<string, { users: Set<string>; playback: { time: number; playing: boolean } }> = {};

io.on("connection", (socket) => {
	socket.on("join-room", ({ roomId, user }) => {
		socket.join(roomId);
		if (!rooms[roomId]) {
			rooms[roomId] = { users: new Set(), playback: { time: 0, playing: false } };
		}
		rooms[roomId].users.add(socket.id);
		// Send current playback state to new user
		socket.emit("playback-state", rooms[roomId].playback);
		// Notify others
		socket.to(roomId).emit("user-joined", { user, id: socket.id });
	});

	socket.on("playback-update", ({ roomId, time, playing }) => {
		if (rooms[roomId]) {
			rooms[roomId].playback = { time, playing };
			// Broadcast to all except sender
			socket.to(roomId).emit("playback-state", { time, playing });
		}
	});

	socket.on("disconnecting", () => {
		for (const roomId of socket.rooms) {
			if (rooms[roomId]) {
				rooms[roomId].users.delete(socket.id);
				io.to(roomId).emit("user-left", { id: socket.id });
			}
		}
	});
});

const PORT = process.env.WATCH_TOGETHER_PORT || 4001;
httpServer.listen(PORT, () => {
	console.log(`Watch Together server running on port ${PORT}`);
});
