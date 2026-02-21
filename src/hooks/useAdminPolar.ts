import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

// Admin Products
export function useAdminProducts() {
	return useQuery(
		orpc.polar.listProducts.queryOptions({ input: { limit: 100, page: 1 } }),
	);
}

export function useAdminCreateProduct() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.polarAdmin.createProduct.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
				queryClient.invalidateQueries({ queryKey: ["polar", "products"] });
			},
		}),
	);
}

export function useAdminUpdateProduct() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.polarAdmin.updateProduct.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
				queryClient.invalidateQueries({ queryKey: ["polar", "products"] });
			},
		}),
	);
}

export function useAdminArchiveProduct() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.polarAdmin.archiveProduct.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
				queryClient.invalidateQueries({ queryKey: ["polar", "products"] });
			},
		}),
	);
}

// Admin Subscriptions
export function useAdminAllSubscriptions(params: {
	limit?: number;
	page?: number;
	status?: string;
	productId?: string;
}) {
	return useQuery(
		orpc.polarAdmin.listAllSubscriptions.queryOptions({
			input: {
				...params,
				status: params.status,
			},
		}),
	);
}

// Admin: Cancel any subscription
export function useAdminCancelSubscription() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.polarAdmin.cancelSubscription.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["admin", "subscriptions"] });
				queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
			},
		}),
	);
}

// Admin: Get subscription detail
export function useAdminSubscriptionDetail(subscriptionId: string | undefined) {
	return useQuery({
		...orpc.polarAdmin.getSubscriptionDetail.queryOptions({
			input: { subscriptionId: subscriptionId },
		}),
		enabled: !!subscriptionId,
	});
}

// Admin: Get subscription stats / analytics
export function useAdminSubscriptionStats() {
	return useQuery({
		...orpc.polarAdmin.getSubscriptionStats.queryOptions(),
		staleTime: 60 * 1000,
	});
}

// Admin Customers
export function useAdminAllCustomers(params: {
	limit?: number;
	page?: number;
}) {
	return useQuery(
		orpc.polarAdmin.listAllCustomers.queryOptions({ input: params }),
	);
}
