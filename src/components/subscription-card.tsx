import { Link } from "@tanstack/react-router";
import { Check, Crown, Sparkles } from "lucide-react";
import { CancelSubscriptionButton } from "@/components/cancel-subscription-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";

export function SubscriptionCard() {
	const { subscription, isLoading, isActive, isPending } = useSubscription();

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Subscription</CardTitle>
					<CardDescription>Loading...</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	const getStatusBadge = () => {
		if (isPending) {
			return <Badge variant="destructive">Pending Cancellation</Badge>;
		}
		if (isActive) {
			return (
				<Badge variant="default" className="bg-green-600">
					Active
				</Badge>
			);
		}
		return <Badge variant="secondary">Free Plan</Badge>;
	};

	const getPlanIcon = () => {
		if (subscription?.currentPlan?.includes("Family")) {
			return <Sparkles className="h-5 w-5" />;
		}
		if (subscription?.currentPlan?.includes("Premium")) {
			return <Crown className="h-5 w-5" />;
		}
		return <Check className="h-5 w-5" />;
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						{getPlanIcon()}
						Current Plan
					</CardTitle>
					{getStatusBadge()}
				</div>
				<CardDescription>{subscription?.currentPlan || "Free"}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{isPending && (
					<div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
						Your subscription will end at the end of your current billing
						period. You'll still have access to premium features until then.
					</div>
				)}

				<div className="flex gap-2">
					{isActive && !isPending && (
						<>
							<Button asChild variant="outline">
								<Link to="/api/portal">Manage Subscription</Link>
							</Button>
							<CancelSubscriptionButton />
						</>
					)}

					{!isActive && (
						<Button asChild>
							<Link to="/pricing">Upgrade Plan</Link>
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
