import { orpc } from "@/orpc/client";

/** Query options for media list (used for search and browse) */
export function mediaListQueryOptions(input: {
	status?: ("DRAFT" | "REVIEW" | "PUBLISHED" | "REJECTED")[];
	search?: string;
	page?: number;
	limit?: number;
}) {
	return orpc.media.list.queryOptions({
		input: {
			status: input.status ?? ["PUBLISHED"],
			search: input.search?.trim() || undefined,
			page: input.page ?? 1,
			limit: input.limit ?? 20,
		},
	});
}

/** Default options for initial list (no search) - for loader prefetch */
export const defaultMediaListQueryOptions = mediaListQueryOptions({
	status: ["PUBLISHED"],
	page: 1,
	limit: 20,
});

/** Query options for trending search terms (dropdown) */
export function trendingSearchesQueryOptions(limit = 8) {
	return orpc.media.trendingSearches.queryOptions({
		input: { limit },
	});
}

/** Query options for search suggestions (dropdown while typing) */
export function searchSuggestionsQueryOptions(input: {
	search?: string;
	limit?: number;
	category?: string;
}) {
	// Normalize search query to match API expectations
	// Handle both string and undefined/null cases safely
	const searchValue = typeof input.search === 'string' ? input.search : '';
	const normalized = searchValue.trim().replace(/\s+/g, " ");
	
	if (!normalized || normalized.length < 2) {
		return {
			queryKey: ["media", "search", "empty", input.category],
			queryFn: async () => ({ data: { items: [], total: 0 }, status: 200, message: "No search query" }),
			enabled: false,
		};
	}
	
	// Map category to media type for API filtering
	const getMediaType = (category?: string): "MOVIE" | "EPISODE" | "TRACK" | undefined => {
		if (!category || category === "all") return undefined;
		if (category === "movies") return "MOVIE";
		if (category === "series") return "EPISODE";
		return undefined; // For trending, recent, favorites, etc.
	};
	
	return orpc.media.search.queryOptions({
		input: {
			query: normalized,
			limit: input.limit ?? 20,
			type: getMediaType(input.category),
			status: ["PUBLISHED"],
		},
	});
}
