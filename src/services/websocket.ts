type Listener = (...args: unknown[]) => void;

class WebSocketService {
	private socket: WebSocket | null = null;
	private listeners: Map<string, Listener[]> = new Map();

	connect(url: string) {
		this.socket = new WebSocket(url);

		this.socket.onopen = () => {
			console.log("WebSocket connected");
		};

		this.socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (this.listeners.has(message.type)) {
				const callbacks = this.listeners.get(message.type);
				if (callbacks) {
					callbacks.forEach((callback) => {
						callback(message.payload);
					});
				}
			}
		};

		this.socket.onclose = () => {
			console.log("WebSocket disconnected");
		};

		this.socket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
	}

	disconnect() {
		if (this.socket) {
			this.socket.close();
		}
	}

	on(type: string, callback: Listener) {
		if (!this.listeners.has(type)) {
			this.listeners.set(type, []);
		}
		this.listeners.get(type)?.push(callback);
	}

	off(type: string, callback: Listener) {
		if (this.listeners.has(type)) {
			const callbacks = this.listeners.get(type);
			if (callbacks) {
				const index = callbacks.indexOf(callback);
				if (index > -1) {
					callbacks.splice(index, 1);
				}
			}
		}
	}

	send(type: string, payload: unknown) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify({ type, payload }));
		}
	}
}

export const webSocketService = new WebSocketService();
