import { orpc } from "@/orpc/client";

/** Section slug to API endpoint mapping */
export type SectionSlug =
	| "latest-releases"
	| "trending"
	| "top-rated"
	| "popular-series"
	| "animation"
	| "tv-series"
	| "horror"
	| "comedy"
	| "romance"
	| "top-imdb-rated";

export type SectionConfig = {
	title: string;
	subtitle: string;
	apiKey:
		| "latestReleases"
		| "trending"
		| "topRated"
		| "popularSeries"
		| "animations"
		| "tvSeries"
		| "horror"
		| "comedy"
		| "romance"
		| "topIMDB";
	endpoint: "content" | "recommendations";
};

/** Map section slugs to API configuration */
export const SECTION_CONFIG: Record<SectionSlug, SectionConfig> = {
	"latest-releases": {
		title: "Latest Releases",
		subtitle: "Fresh from the cinema",
		apiKey: "latestReleases",
		endpoint: "content",
	},
	trending: {
		title: "Trending",
		subtitle: "Popular this week",
		apiKey: "trending",
		endpoint: "recommendations",
	},
	"top-rated": {
		title: "Top Rated",
		subtitle: "Highest rated by critics and audiences",
		apiKey: "topRated",
		endpoint: "recommendations",
	},
	"popular-series": {
		title: "Popular Series",
		subtitle: "Binge-worthy shows everyone's talking about",
		apiKey: "popularSeries",
		endpoint: "content",
	},
	animation: {
		title: "Animation",
		subtitle: "Animated masterpieces for all ages",
		apiKey: "animations",
		endpoint: "content",
	},
	"tv-series": {
		title: "TV Series",
		subtitle: "Binge-worthy episodes and seasons",
		apiKey: "tvSeries",
		endpoint: "content",
	},
	horror: {
		title: "Horror",
		subtitle: "Spine-chilling thrills and scares",
		apiKey: "horror",
		endpoint: "content",
	},
	comedy: {
		title: "Comedy",
		subtitle: "Laugh out loud moments",
		apiKey: "comedy",
		endpoint: "content",
	},
	romance: {
		title: "Romance",
		subtitle: "Heartwarming love stories",
		apiKey: "romance",
		endpoint: "content",
	},
	"top-imdb-rated": {
		title: "Top IMDB Rated",
		subtitle: "Highest rated films of all time",
		apiKey: "topIMDB",
		endpoint: "content",
	},
};

/** Get infinite query options for a specific section */
export function getSectionInfiniteQueryOptions(
	section: SectionSlug,
	limit = 20,
) {
	const config = SECTION_CONFIG[section];

	if (!config) {
		throw new Error(`Unknown section: ${section}`);
	}

	const { apiKey, endpoint } = config;

	if (endpoint === "content") {
		// Type-safe access to content APIs
		const contentApi = orpc.content[
			apiKey as keyof typeof orpc.content
		] as unknown as {
			query: (params: {
				input: {
					limit: number;
					page: number;
					type?: "MOVIE" | "EPISODE" | "TRACK";
				};
			}) => Promise<unknown>;
		};

		return {
			queryKey: ["section", section, limit] as const,
			queryFn: async ({ pageParam = 1 }) => {
				const response = await contentApi.query({
					input: { limit, page: pageParam, type: "MOVIE" },
				});
				return response;
			},
			getNextPageParam: (lastPage: unknown, pages: unknown[]) => {
				const page = lastPage as { data?: { items?: unknown[] } };
				// If we got a full page, there might be more
				if (page?.data?.items?.length === limit) {
					return pages.length + 1;
				}
				return undefined;
			},
			initialPageParam: 1,
		};
	} else {
		// Recommendations endpoint
		const recApi = orpc.recommendations[
			apiKey as keyof typeof orpc.recommendations
		] as unknown as {
			query: (params: { input: Record<string, unknown> }) => Promise<unknown>;
		};

		return {
			queryKey: ["section", section, limit] as const,
			queryFn: async ({ pageParam = 1 }) => {
				const input =
					apiKey === "trending"
						? { limit, page: pageParam, type: "MOVIE" as const, days: 7 }
						: { limit, page: pageParam, type: "MOVIE" as const };

				const response = await recApi.query({ input });
				return response;
			},
			getNextPageParam: (lastPage: unknown, pages: unknown[]) => {
				const page = lastPage as { data?: { items?: unknown[] } };
				if (page?.data?.items?.length === limit) {
					return pages.length + 1;
				}
				return undefined;
			},
			initialPageParam: 1,
		};
	}
}
