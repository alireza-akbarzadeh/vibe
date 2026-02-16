import { client } from "@/orpc/client";

/** Section slug to API endpoint mapping */
export type SectionSlug =
	| "latest-releases"
	| "trending"
	| "trending-now"
	| "top-rated"
	| "popular-series"
	| "animation"
	| "tv-series"
	| "horror"
	| "comedy"
	| "romance"
	| "top-imdb-rated"
	| "my-list";

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
	"trending-now": {
		title: "Trending Now",
		subtitle: "What's popular this week",
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
	"my-list": {
		title: "My List",
		subtitle: "Your personal collection",
		apiKey: "latestReleases", // Not really used but needs to be one of the keys
		endpoint: "content",
	},
};

const sectionToCategory: Record<SectionSlug, string> = {
	"latest-releases": "RECENT",
	trending: "TRENDING",
	"trending-now": "TRENDING",
	"top-rated": "TOP_RATED",
	"popular-series": "SERIES",
	animation: "ANIMATION",
	"tv-series": "TV_SERIES",
	horror: "HORROR",
	comedy: "COMEDY",
	romance: "ROMANCE",
	"top-imdb-rated": "TOP_IMDB",
	"my-list": "MY_LIST",
};

/** Get infinite query options for a specific section */
export function getSectionInfiniteQueryOptions(
	section: SectionSlug,
	limit = 20,
	search?: string,
	filters?: {
		genreIds?: string[];
		releaseYearFrom?: number;
		releaseYearTo?: number;
		sortBy?: "NEWEST" | "OLDEST" | "TITLE" | "MANUAL";
	},
) {
	const category = sectionToCategory[section];

	return {
		queryKey: ["section", section, limit, search, filters] as const,
		queryFn: async ({ pageParam = 1 }) => {
			const response = await client.media.list({
				limit,
				page: pageParam as number,
				category: category as any,
				search: search || undefined,
				type: "MOVIE",
				genreIds: filters?.genreIds,
				releaseYearFrom: filters?.releaseYearFrom,
				releaseYearTo: filters?.releaseYearTo,
				sortBy: filters?.sortBy || "NEWEST",
			});
			return response;
		},
		getNextPageParam: (lastPage: any, allPages: unknown[]) => {
			const items = lastPage?.data?.items || [];
			if (items.length === limit) {
				return allPages.length + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
	};
}
