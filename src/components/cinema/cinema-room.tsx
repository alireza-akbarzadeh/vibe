import { useRouteContext } from "@tanstack/react-router";
import { MessageCircle, Users } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/video-payler/video-player";
import { VIDEOS } from "@/constants/media";
import { Route } from "@/routes/(cinema)/room/$roomId";
import { webSocketService } from "@/services/websocket";

interface Message {
	id: string;
	user: User;
	text: string;
}

interface User {
	id: string;
	name: string;
	image: string | null;
}

export const CinemaRoom: React.FC = () => {
	const { roomId } = Route.useParams();
	const { auth } = useRouteContext({ from: "__root__" });
	const user = auth?.user;
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [showChat, setShowChat] = useState(false);

	const videoData = {
		src: VIDEOS.demo,
		videoPoster:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop",
		year: "2014",
		totalTime: "2:49:00",
		videoName: "Interstellar",
	};

	useEffect(() => {
		webSocketService.connect(`ws://localhost:3000/ws?roomId=${roomId}`);

		webSocketService.send("join-room", { user });

		webSocketService.on("message", (newMessage: Message) => {
			setMessages((prevMessages) => [
				...prevMessages,
				{ ...newMessage, id: uuidv4() },
			]);
		});

		webSocketService.on("user-list", (userList: User[]) => {
			setUsers(userList);
		});

		return () => {
			webSocketService.disconnect();
		};
	}, [roomId, user]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		webSocketService.send("message", { user, text: message });
		setMessage("");
	};

	return (
		<div className="relative h-screen w-screen bg-black">
			<VideoPlayer videoId={roomId} {...videoData} />
			<div
				className={`absolute top-0 right-0 h-full w-96 bg-black/80 z-10 transition-transform duration-300 ${showChat ? "translate-x-0" : "translate-x-full"}`}
			>
				<div className="flex flex-col h-full">
					<div className="p-4 border-b border-zinc-700">
						<h2 className="text-white text-lg font-bold flex items-center gap-2">
							<Users className="w-6 h-6" />
							<span>Users ({users.length})</span>
						</h2>
						<ul className="mt-2 space-y-2">
							{users.map((u) => (
								<li key={u.id} className="flex items-center gap-2 text-white">
									<img
										src={
											u.image ||
											`https://avatar.vercel.sh/${encodeURIComponent(u.name)}`
										}
										alt={u.name}
										className="w-8 h-8 rounded-full"
									/>
									<span>{u.name}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="flex-1 p-4 overflow-y-auto">
						<h2 className="text-white text-lg font-bold mb-4">Chat</h2>
						<ul className="space-y-4">
							{messages.map((msg) => (
								<li key={msg.id} className="flex items-start gap-2 text-white">
									<img
										src={
											msg.user?.image ||
											`https://avatar.vercel.sh/${encodeURIComponent(msg.user?.name)}`
										}
										alt={msg.user?.name}
										className="w-8 h-8 rounded-full"
									/>
									<div>
										<span className="font-bold">{msg.user?.name}</span>
										<p>{msg.text}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
					<form
						onSubmit={handleSendMessage}
						className="p-4 border-t border-zinc-700"
					>
						<div className="flex gap-2">
							<input
								type="text"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none"
								placeholder="Type a message..."
							/>
							<Button
								type="submit"
								className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold"
							>
								Send
							</Button>
						</div>
					</form>
				</div>
			</div>
			<Button
				size="icon"
				variant="ghost"
				aria-label="Toggle Chat"
				className="absolute top-4 right-4 z-20 text-white"
				onClick={() => setShowChat(!showChat)}
			>
				<MessageCircle className="w-6 h-6" />
			</Button>
		</div>
	);
};
