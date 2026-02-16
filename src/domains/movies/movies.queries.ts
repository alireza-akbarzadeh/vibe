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
}) {
	if (!input.search || input.search.trim().length === 0) {
		return {
			queryKey: ["media", "search", "empty"],
			queryFn: async () => ({ data: { items: [], total: 0 }, status: 200, message: "No search query" }),
			enabled: false,
		};
	}
	
	return orpc.media.search.queryOptions({
		input: {
			query: input.search.trim(),
			limit: input.limit ?? 20,
			status: ["PUBLISHED"],
		},
	});
}
