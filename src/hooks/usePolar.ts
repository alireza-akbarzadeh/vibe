import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";

/**
 * Fetch all available products
 */
export function usePolarProducts(options?: { limit?: number; page?: number }) {
	return useQuery(
		orpc.polar.listProducts.queryOptions({
			input: {
				limit: options?.limit || 20,
				page: options?.page || 1,
			},
		}),
	);
}

/**
 * Fetch a specific product
 */
export function usePolarProduct(productId: string | undefined) {
	return useQuery(
		orpc.polar.getProduct.queryOptions({
			input: { productId: productId! },
			enabled: !!productId,
		}),
	);
}

/**
 * Fetch user's subscriptions
 */
export function usePolarSubscriptions(options?: {
	limit?: number;
	page?: number;
	status?: string;
	productId?: string;
}) {
	return useQuery(
		orpc.polar.listSubscriptions.queryOptions({
			input: {
				limit: options?.limit || 20,
				page: options?.page || 1,
				status: options?.status as any,
				productId: options?.productId,
			},
		}),
	);
}

/**
 * Fetch a specific subscription
 */
export function usePolarSubscription(subscriptionId: string | undefined) {
	return useQuery(
		orpc.polar.getSubscription.queryOptions({
			input: { subscriptionId: subscriptionId! },
			enabled: !!subscriptionId,
		}),
	);
}

/**
 * Fetch customer information
 */
export function usePolarCustomer() {
	return useQuery(orpc.polar.getCustomer.queryOptions());
}

/**
 * Create a checkout session
 */
export function useCreateCheckout() {
	return useMutation(
		orpc.polar.createCheckout.mutationOptions({
			onSuccess: (data) => {
				window.location.href = data.url;
			},
		}),
	);
}

/**
 * Cancel a subscription
 */
export function useCancelSubscription() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.polar.cancelSubscription.mutationOptions({
			onSuccess: () => {
				// Invalidate subscriptions cache
				queryClient.invalidateQueries({ queryKey: ["polar", "subscriptions"] });
				queryClient.invalidateQueries({ queryKey: ["polar", "customer"] });
			},
		}),
	);
}

/**
 * Update a subscription (change plan or toggle auto-renewal)
 */
export function useUpdateSubscription() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.polar.updateSubscription.mutationOptions({
			onSuccess: (_, variables) => {
				// Invalidate specific subscription and list
				queryClient.invalidateQueries({
					queryKey: ["polar", "subscription", variables.subscriptionId],
				});
				queryClient.invalidateQueries({ queryKey: ["polar", "subscriptions"] });
			},
		}),
	);
}

/**
 * Sync subscription status from Polar
 * (Admin only or for manual reconciliation)
 */
export function useSyncSubscriptionStatus() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.polar.syncSubscriptionStatus.mutationOptions({
			onSuccess: () => {
				// Invalidate all user-related queries
				queryClient.invalidateQueries({ queryKey: ["polar"] });
			},
		}),
	);
}

/**
 * Combined hook for subscription management page
 */
export function useSubscriptionManagement() {
	const subscriptions = usePolarSubscriptions();
	const customer = usePolarCustomer();
	const cancelMutation = useCancelSubscription();
	const updateMutation = useUpdateSubscription();

	return {
		subscriptions: subscriptions.data?.subscriptions || [],
		customer: customer.data,
		isLoading: subscriptions.isLoading || customer.isLoading,
		error: subscriptions.error || customer.error,
		cancelSubscription: cancelMutation.mutate,
		updateSubscription: updateMutation.mutate,
		isCanceling: cancelMutation.isPending,
		isUpdating: updateMutation.isPending,
	};
}

/**
 * Hook for pricing page with checkout creation
 */
export function usePricingPage() {
	const products = usePolarProducts({ limit: 100 });
	const checkoutMutation = useCreateCheckout();

	const handlePurchase = (productPriceId: string, successUrl?: string) => {
		checkoutMutation.mutate({
			productPriceId,
			successUrl: successUrl || `${window.location.origin}/success-payment`,
		});
	};

	return {
		products: products.data?.products || [],
		isLoading: products.isLoading,
		error: products.error,
		handlePurchase,
		isCreatingCheckout: checkoutMutation.isPending,
	};
}
