import { useIntersection } from "@mantine/hooks";
import {
	keepPreviousData,
	type UseQueryOptions,
	useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Hook to detect when a section comes into viewport
 * Used for lazy loading content on scroll
 */
export function useLazySection(rootMargin = "300px") {
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

	return {
		ref,
		isVisible: hasIntersected,
	};
}

/**
 * Hook to detect when a section comes into viewport and fetch data
 */
export function useLazyQuerySection<TData = unknown>(
	options: UseQueryOptions<TData>,
	rootMargin = "300px",
) {
	const { ref, isVisible } = useLazySection(rootMargin);

	const query = useQuery({
		...options,
		enabled: isVisible && options.enabled !== false,
		placeholderData: keepPreviousData,
	});

	return {
		ref,
		isVisible,
		...query,
	};
}
