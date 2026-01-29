import { Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function SharedButton() {
	const handleShare = async () => {
		try {
			const url = window.location.href;
			await navigator.share({
				url,
			});
		} catch (error) {
			toast("Failed to Share link");
		}
	};
	return (
		<Button
			onClick={handleShare}
			size="lg"
			variant="ghost"
			className="bg-white/5 hover:bg-white/10 text-white rounded-full"
		>
			<Share2 className="w-5 h-5" />
		</Button>
	);
}
