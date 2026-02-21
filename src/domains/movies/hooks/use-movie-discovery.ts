import { useQuery } from "@tanstack/react-query";
import { useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { useLazySection } from "@/hooks/useLazySection";
import { orpc } from "@/lib/orpc";
import type { MediaList } from "@/orpc/models/media.schema";
import type { MovieSearchQuery } from "@/routes/(home)/movies";
import { searchSuggestionsQueryOptions } from "../movies.queries";
import { useMoviesStore } from "../store";

export interface UseMovieDiscoveryProps {
	searchQueryProp?: MovieSearchQuery;
	onSearchChange?: (query: MovieSearchQuery) => void;
}

export function useMovieDiscovery({
	searchQueryProp,
	onSearchChange,
}: UseMovieDiscoveryProps = {}) {
	const containerRef = useRef(null);
	const { scrollYProgress } = useScroll();

	const searchQuery = searchQueryProp?.query ?? "";
	const activeCategory = useMoviesStore((state) => state.activeCategory);
	const setSearchQuery = onSearchChange ?? (() => {});

	const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

	const searchQueryOptions = searchSuggestionsQueryOptions({
		search: searchQuery || undefined,
		limit: 20,
		category: activeCategory,
	});
	const {
		data: searchResponse,
		isLoading: isSearchLoading,
		isFetching: isSearchFetching,
	} = useQuery({
		...searchQueryOptions,
		enabled: searchQuery.length > 0,
	});

	// Intersection observers for lazy loading sections
	const trendingSection = useLazySection("300px");
	const topRatedSection = useLazySection("300px");
	const popularSeriesSection = useLazySection("300px");
	const animationsSection = useLazySection("300px");
	const tvSeriesSection = useLazySection("300px");
	const horrorSection = useLazySection("300px");
	const comedySection = useLazySection("300px");
	const romanceSection = useLazySection("300px");
	const topIMDBSection = useLazySection("300px");
	const favoritesSection = useLazySection("100px");

	const mediaType = (activeCategory === "series" ? "EPISODE" : "MOVIE") as
		| "MOVIE"
		| "EPISODE"
		| "TRACK"
		| undefined;

	const { data: latestData } = useQuery(
		orpc.content.latestReleases.queryOptions({
			input: {
				type: mediaType,
				limit: 15,
			},
		}),
	);

	const { data: favoritesData } = useQuery({
		...orpc.favorites.list.queryOptions({
			input: { limit: 20 },
		}),
		enabled: favoritesSection.isVisible || activeCategory === "favorites",
		staleTime: 5 * 60 * 1000,
	});

	const { data: trendingData } = useQuery({
		...orpc.recommendations.trending.queryOptions({
			input: {
				type: mediaType,
				limit: 15,
				days: 7,
			},
		}),
		enabled: trendingSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const { data: topRatedData } = useQuery({
		...orpc.recommendations.topRated.queryOptions({
			input: {
				type: mediaType,
				limit: 15,
			},
		}),
		enabled: topRatedSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const { data: popularSeriesData } = useQuery({
		...orpc.content.popularSeries.queryOptions({
			input: { limit: 15 },
		}),
		enabled: popularSeriesSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const { data: animationsData } = useQuery({
		...orpc.content.animations.queryOptions({
			input: { limit: 15 },
		}),
		enabled: animationsSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const { data: tvSeriesData } = useQuery({
		...orpc.content.tvSeries.queryOptions({
			input: { limit: 15 },
		}),
		enabled: tvSeriesSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const { data: horrorData } = useQuery({
		...orpc.content.horror.queryOptions({
			input: { limit: 15 },
		}),
		enabled: horrorSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const { data: comedyData } = useQuery({
		...orpc.content.comedy.queryOptions({
			input: { limit: 15 },
		}),
		enabled: comedySection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const { data: romanceData } = useQuery({
		...orpc.content.romance.queryOptions({
			input: { limit: 15 },
		}),
		enabled: romanceSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const { data: topIMDBData } = useQuery({
		...orpc.content.topIMDB.queryOptions({
			input: {
				type: mediaType,
				limit: 15,
			},
		}),
		enabled: topIMDBSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const latestMovies: MediaList[] = latestData?.data?.items ?? [];
	const myFavorites: MediaList[] = (favoritesData?.data?.items ?? []).map(
		(f) => f.media as MediaList,
	);
	const trendingMovies: MediaList[] = trendingData?.data?.items ?? [];
	const topRated: MediaList[] = topRatedData?.data?.items ?? [];
	const popularSeries: MediaList[] = popularSeriesData?.data?.items ?? [];
	const animation: MediaList[] = animationsData?.data?.items ?? [];
	const tvSeries: MediaList[] = tvSeriesData?.data?.items ?? [];
	const horror: MediaList[] = horrorData?.data?.items ?? [];
	const comedy: MediaList[] = comedyData?.data?.items ?? [];
	const romance: MediaList[] = romanceData?.data?.items ?? [];
	const topIMDB: MediaList[] = topIMDBData?.data?.items ?? [];
	const recommended: MediaList[] = useMemo(() => {
		return [...latestMovies, ...trendingMovies, ...topRated]
			.sort(() => Math.random() - 0.5)
			.slice(0, 6);
	}, [latestMovies, trendingMovies, topRated]);

	const showSearchResults = searchQuery.length > 0;
	const searchItems: MediaList[] = searchResponse?.data?.items ?? [];
	const searchLoading = isSearchLoading || isSearchFetching;

	return {
		containerRef,
		backgroundY,
		searchQuery,
		activeCategory,
		setSearchQuery,
		latestMovies,
		myFavorites,
		trendingMovies,
		topRated,
		popularSeries,
		animation,
		tvSeries,
		horror,
		comedy,
		romance,
		topIMDB,
		recommended,
		showSearchResults,
		searchItems,
		searchLoading,
		trendingSection,
		topRatedSection,
		popularSeriesSection,
		animationsSection,
		tvSeriesSection,
		horrorSection,
		comedySection,
		romanceSection,
		topIMDBSection,
		favoritesSection,
	};
}
