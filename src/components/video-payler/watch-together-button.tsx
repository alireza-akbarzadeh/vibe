import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

function generateSessionId() {
	return Math.random().toString(36).slice(2, 10);
}

export function WatchTogetherButton({ playId }: { playId: string }) {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [popoverOpen, setPopoverOpen] = useState(false);
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

	const handleCreate = () => {
		const id = generateSessionId();
		setSessionId(id);
		if (typeof window !== "undefined") {
			window.history.replaceState({}, "", `?together=${id}`);
		}
		setPopoverOpen(true);
	};

	const handleCopy = () => {
		if (typeof navigator !== "undefined") {
			navigator.clipboard.writeText(url);
			setCopied(true);
			toast.success("Session link copied!");
			setTimeout(() => setCopied(false), 1200);
		}
	};

	return (
		<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					aria-label="Watch Together"
					onClick={() => {
						if (!sessionId) handleCreate();
						else setPopoverOpen(true);
					}}
				>
					<Users className="w-5 h-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="flex flex-col gap-2">
					<div className="font-bold text-sm mb-1">Watch Together</div>
					<Input value={url} readOnly className="w-full" />
					<Button onClick={handleCopy} variant="outline" size="sm">
						{copied ? "Copied!" : "Copy Link"}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
