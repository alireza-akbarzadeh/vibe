import { useIntersection } from "@mantine/hooks";

/**
 * Hook to detect when a section comes into viewport
 * Used for lazy loading content on scroll
 *
 * @param rootMargin - Distance from viewport edge to trigger (default: 300px)
 * @returns ref to attach to element and whether it's visible
 */
export function useLazySection(rootMargin = "300px") {
	const { ref, entry } = useIntersection({
		threshold: 0.1,
		rootMargin,
	});

	const isVisible = entry?.isIntersecting ?? false;

	return {
		ref,
		isVisible,
	};
}
