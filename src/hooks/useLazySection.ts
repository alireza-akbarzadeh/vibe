import { useIntersection } from "@mantine/hooks";
import {
	keepPreviousData,
	type UseQueryOptions,
	useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Hook to detect when a section comes into viewport and fetch data
 * Used for lazy loading content on scroll
 *
 * @param options - React Query options
 * @param rootMargin - Distance from viewport edge to trigger (default: 300px)
 * @returns ref, data, and visibility status
 */
export function useLazySection<TData = unknown>(
	options: UseQueryOptions<TData>,
	rootMargin = "300px",
) {
	const { ref, entry } = useIntersection({
		threshold: 0.01,
		rootMargin,
	});

	const [hasIntersected, setHasIntersected] = useState(false);
	const isIntersecting = entry?.isIntersecting ?? false;

	useEffect(() => {
		if (isIntersecting && !hasIntersected) {
			setHasIntersected(true);
		}
	}, [isIntersecting, hasIntersected]);

	const query = useQuery({
		...options,
		enabled: hasIntersected && options.enabled !== false,
		placeholderData: keepPreviousData,
	});

	return {
		ref,
		isVisible: hasIntersected,
		...query,
	};
}
