import { Loader2, UserMinus } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SuspendAction({ userId }: { userId: string }) {
	const [isPending, setIsPending] = React.useState(false);

	const handleSuspend = async (e: Event) => {
		e.preventDefault(); // Prevent dropdown from closing immediately
		setIsPending(true);

		try {
			// Simulate API Call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success(`Account ${userId} suspended successfully.`);
		} catch (_err) {
			toast.error("Failed to suspend account.");
		} finally {
			setIsPending(false);
		}
	};

	return (
		<DropdownMenuItem
			disabled={isPending}
			onSelect={handleSuspend}
			className="text-destructive focus:bg-destructive focus:text-white rounded-xl py-2 cursor-pointer"
		>
			{isPending ? (
				<Loader2 className="h-4 w-4 mr-2 animate-spin" />
			) : (
				<UserMinus className="h-4 w-4 mr-2" />
			)}
			<span>{isPending ? "Processing..." : "Suspend Account"}</span>
		</DropdownMenuItem>
	);
}
