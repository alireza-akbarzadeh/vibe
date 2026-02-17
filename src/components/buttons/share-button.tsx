import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SharedButtonProps {
	className?: string;
}
export function SharedButton(props: SharedButtonProps) {
	const { className } = props;
	const handleShare = async () => {
		try {
			const url = window.location.href;
			await navigator.share({
				url,
			});
		} catch (_error) {
			toast("Failed to Share link");
		}
	};
	return (
		<Button
			onClick={handleShare}
			size="lg"
			variant="ghost"
			className={cn("bg-white/5 hover:bg-white/10 text-white rounded-full", className)}
		>
			<Share2 className="w-5 h-5" />
		</Button>
	);
}
