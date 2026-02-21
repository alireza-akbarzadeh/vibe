import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/lib/orpc";
import type { SubscriptionResponse } from "@/orpc/models/polar";

interface SubscriptionStatus {
	status: "FREE" | "PREMIUM" | "FAMILY" | "CANCELLED" | "NONE";
	currentPlan: string | null;
	customerId: string | null;
	subscriptionId?: string | null;
	amount?: number;
	currency?: string;
	interval?: string | null;
	currentPeriodEnd?: string | null;
}

interface ListSubscriptionsResponse {
	subscriptions: SubscriptionResponse[];
	total: number;
	page: number;
	limit: number;
}

export function useSubscription() {
	const queryClient = useQueryClient();

	// Get subscription status from Polar
	const subscriptionQuery = orpc.polar.listSubscriptions.queryOptions({
		input: {
			page: 1,
			limit: 10,
		},
	});
	const {
		data: subscription,
		isLoading,
		error,
	} = useQuery({
		queryKey: subscriptionQuery.queryKey,
		queryFn: subscriptionQuery.queryFn,
		select: (result: ListSubscriptionsResponse): SubscriptionStatus => {
			if (!result?.subscriptions || result.subscriptions.length === 0) {
				return {
					status: "FREE" as const,
					currentPlan: null,
					customerId: null,
				};
			}

			const sub = result.subscriptions[0];

			// Map status to our system
			let status: "FREE" | "PREMIUM" | "FAMILY" | "CANCELLED" | "NONE" = "NONE";
			if (sub.status === "active") {
				status = sub.productName.toLowerCase().includes("family")
					? "FAMILY"
					: "PREMIUM";
			} else if (sub.status === "canceled" || sub.cancelAtPeriodEnd) {
				status = "CANCELLED";
			} else if (sub.status === "trialing") {
				status = "PREMIUM";
			}

			return {
				status,
				currentPlan: sub.productName,
				customerId: null,
				subscriptionId: sub.id,
				amount: sub.amount,
				currency: sub.currency,
				interval: sub.interval,
				currentPeriodEnd: sub.currentPeriodEnd,
			};
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	// Cancel subscription mutation using Polar
	const cancelMutation = useMutation(
		orpc.polar.cancelSubscription.mutationOptions({
			onSuccess: (data) => {
				// Invalidate and refetch subscription status
				queryClient.invalidateQueries({ queryKey: ["subscription", "status"] });
				queryClient.invalidateQueries({ queryKey: ["polar", "subscriptions"] });

				// Show success message
				if (data.success) {
					toast.success(
						data.message ||
							"Subscription will end at the end of your billing period",
					);
				}
			},
			onError: (error: Error) => {
				toast.error("Failed to cancel subscription", {
					description: error.message,
				});
			},
		}),
	);

	return {
		subscription,
		isLoading,
		error,
		isActive:
			subscription?.status === "PREMIUM" || subscription?.status === "FAMILY",
		isPending: subscription?.status === "CANCELLED",
		isFree: subscription?.status === "FREE" || subscription?.status === "NONE",
		cancelSubscription: cancelMutation.mutate,
		isCancelling: cancelMutation.isPending,
	};
}
