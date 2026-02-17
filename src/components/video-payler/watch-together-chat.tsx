import { useEffect, useRef, useState } from "react";
import { getWatchTogetherSocket } from "@/lib/watch-together-client";
import { useRouteContext } from "@tanstack/react-router";

export function WatchTogetherChat({ sessionId }: { sessionId: string }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const { auth } = useRouteContext({ from: "__root__" });
    const user = auth?.user;
    const socketRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sessionId) return;
        const socket = getWatchTogetherSocket();
        socketRef.current = socket;
        socket.emit("join-chat", { roomId: sessionId, user });
        socket.on("chat-message", (msg) => setMessages((m) => [...m, msg]));
        return () => { socket.disconnect(); };
    }, [sessionId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;
        socketRef.current?.emit("chat-message", {
            roomId: sessionId,
            user,
            text: input.trim(),
            time: Date.now(),
        });
        setInput("");
    };

    return (
        <aside className="absolute right-0 top-0 h-full w-80 bg-zinc-900/95 border-l border-zinc-800 flex flex-col z-40">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <img
                            src={msg.user?.image || `https://avatar.vercel.sh/${encodeURIComponent(msg.user?.name || "u")}`}
                            alt={msg.user?.name || "User"}
                            className="w-7 h-7 rounded-full border border-white/10"
                        />
                        <div>
                            <div className="text-xs font-bold text-white">{msg.user?.name || "User"}</div>
                            <div className="text-sm text-zinc-200 bg-zinc-800 rounded-lg px-3 py-1 mt-0.5 max-w-xs break-words">
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-3 border-t border-zinc-800 flex gap-2 bg-zinc-900">
                <input
                    className="flex-1 rounded-lg bg-zinc-800 text-white px-3 py-2 outline-none"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(); }}
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold">Send</button>
            </form>
        </aside>
    );
}
