import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/orpc/client";

// Admin Products
export function useAdminProducts() {
	return useQuery({
		queryKey: ["admin", "products"],
		queryFn: async () => {
			return client.polar.listProducts({ limit: 100, page: 1 });
		},
	});
}

export function useAdminCreateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: {
			name: string;
			description?: string;
			recurringInterval: "day" | "week" | "month" | "year";
			recurringIntervalCount?: number;
			prices: Array<{ priceAmount: number; priceCurrency?: string }>;
			trialInterval?: "day" | "week" | "month" | "year" | null;
			trialIntervalCount?: number | null;
		}) => {
			return client.polarAdmin.createProduct(input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
			queryClient.invalidateQueries({ queryKey: ["polar", "products"] });
		},
	});
}

export function useAdminUpdateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: {
			productId: string;
			name?: string;
			description?: string | null;
		}) => {
			return client.polarAdmin.updateProduct(input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
			queryClient.invalidateQueries({ queryKey: ["polar", "products"] });
		},
	});
}

export function useAdminArchiveProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (productId: string) => {
			return client.polarAdmin.archiveProduct({ productId });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
			queryClient.invalidateQueries({ queryKey: ["polar", "products"] });
		},
	});
}

// Admin Subscriptions
export function useAdminAllSubscriptions(params: {
	limit?: number;
	page?: number;
	status?: string;
	productId?: string;
}) {
	return useQuery({
		queryKey: ["admin", "subscriptions", params],
		queryFn: async () => {
			return client.polarAdmin.listAllSubscriptions({
				...params,
				status: params.status as any,
			});
		},
	});
}

// Admin: Cancel any subscription
export function useAdminCancelSubscription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: {
			subscriptionId: string;
			immediately?: boolean;
			reason?: string;
		}) => {
			return client.polarAdmin.cancelSubscription(input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "subscriptions"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
	});
}

// Admin: Get subscription detail
export function useAdminSubscriptionDetail(subscriptionId: string | undefined) {
	return useQuery({
		queryKey: ["admin", "subscription", subscriptionId],
		queryFn: async () => {
			return client.polarAdmin.getSubscriptionDetail({
				subscriptionId: subscriptionId!,
			});
		},
		enabled: !!subscriptionId,
	});
}

// Admin: Get subscription stats / analytics
export function useAdminSubscriptionStats() {
	return useQuery({
		queryKey: ["admin", "stats"],
		queryFn: async () => {
			return client.polarAdmin.getSubscriptionStats();
		},
		staleTime: 60 * 1000, // 1 minute
	});
}

// Admin Customers
export function useAdminAllCustomers(params: {
	limit?: number;
	page?: number;
}) {
	return useQuery({
		queryKey: ["admin", "customers", params],
		queryFn: async () => {
			return client.polarAdmin.listAllCustomers(params);
		},
	});
}
