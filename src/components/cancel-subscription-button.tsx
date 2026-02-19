import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

export function CancelSubscriptionButton() {
	const { subscription, cancelSubscription, isCancelling, isActive } =
		useSubscription();
	const [isOpen, setIsOpen] = useState(false);

	// Don't show button if no active subscription
	if (!isActive) {
		return null;
	}

	const handleCancel = () => {
		cancelSubscription();
		setIsOpen(false);
	};

	return (
		<AlertDialog open={isOpen} onSetOpen={setIsOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="outline" className="text-destructive">
					Cancel Subscription
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						Cancel Subscription?
					</AlertDialogTitle>
					<AlertDialogDescription className="space-y-2">
						<p>
							Are you sure you want to cancel your{" "}
							<strong>{subscription?.currentPlan}</strong> subscription?
						</p>
						<p>
							Your subscription will remain active until the end of your current
							billing period. After that, you'll be downgraded to the Free plan.
						</p>
						<p className="text-sm text-muted-foreground">
							You can resubscribe at any time from the pricing page.
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isCancelling}>
						Keep Subscription
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleCancel}
						disabled={isCancelling}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isCancelling ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Cancelling...
							</>
						) : (
							"Yes, Cancel Subscription"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
