import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { orpc } from "@/orpc/client";
import type { MediaList } from "@/orpc/models/media.schema";
import type { MovieSearchQuery } from "@/routes/(home)/movies";
import {
	CategoryNav,
	HeroBanner,
	MovieCarousel,
	SearchHeader,
} from "./components";
import { SearchResultsEmpty } from "./components/movie-search/search-results-empty";
import { SearchResultsList } from "./components/movie-search/search-results-list";
import { SearchResultsSkeleton } from "./components/movie-search/search-results-skeleton";
import { mediaListQueryOptions } from "./movies.queries";



/** Min height for search results area to avoid layout shift and support LCP */
export const SEARCH_RESULTS_MIN_HEIGHT = 420;


export interface MovieDiscoveryProps {
	query?: MovieSearchQuery
	onSearchChange?: (query: MovieSearchQuery) => void;
}

export default function MovieDiscovery(props: MovieDiscoveryProps = {}) {
	const { query: searchQueryProp, onSearchChange } = props

	const containerRef = useRef(null);
	const { scrollYProgress } = useScroll();

	const searchQuery = searchQueryProp?.query ?? "";
	const activeCategory = searchQueryProp?.activeCategory ?? "all";
	const setSearchQuery = onSearchChange ?? (() => { });

	const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

	const searchQueryOptions = mediaListQueryOptions({
		search: searchQuery || undefined,
		limit: 20,
	});
	const {
		data: searchResponse,
		isLoading: isSearchLoading,
		isFetching: isSearchFetching,
	} = useQuery({
		...searchQueryOptions,
		enabled: searchQuery.length > 0,
	});

	const { data: latestData } = useSuspenseQuery(
		orpc.content.latestReleases.queryOptions({
			input: { type: "MOVIE", limit: 10 },
		}),
	);
	const { data: popularSeriesData } = useSuspenseQuery(
		orpc.content.popularSeries.queryOptions({
			input: { limit: 10 },
		}),
	);
	const { data: trendingData } = useSuspenseQuery(
		orpc.recommendations.trending.queryOptions({
			input: { type: "MOVIE", limit: 10, days: 7 },
		}),
	);
	const { data: topRatedData } = useSuspenseQuery(
		orpc.recommendations.topRated.queryOptions({
			input: { type: "MOVIE", limit: 10 },
		}),
	);
	const { data: animationsData } = useSuspenseQuery(
		orpc.content.animations.queryOptions({
			input: { limit: 10 },
		}),
	);

	const latestMovies: MediaList[] = latestData?.data?.items ?? [];
	const popularSeries: MediaList[] = popularSeriesData?.data?.items ?? [];
	const trendingMovies: MediaList[] = trendingData?.data?.items ?? [];
	const topRated: MediaList[] = topRatedData?.data?.items ?? [];
	const animation: MediaList[] = animationsData?.data?.items ?? [];
	const recommended: MediaList[] = [...latestMovies, ...topRated]
		.sort(() => Math.random() - 0.5)
		.slice(0, 6);


	const showSearchResults = searchQuery.length > 0;
	const searchItems: MediaList[] = searchResponse?.data?.items ?? [];
	const searchLoading = isSearchLoading || isSearchFetching;

	return (
		<div
			ref={containerRef}
			className="min-h-screen bg-[#0a0a0a] relative overflow-hidden"
		>
			<motion.div
				style={{ y: backgroundY }}
				className="fixed inset-0 pointer-events-none"
			>
				<div className="absolute inset-0 bg-linear-to-b from-purple-900/10 via-black to-black" />

				<motion.div
					animate={{
						opacity: [0.3, 0.5, 0.3],
						scale: [1, 1.2, 1],
					}}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						opacity: [0.2, 0.4, 0.2],
						scale: [1.2, 1, 1.2],
					}}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
				/>

				<div
					className="absolute inset-0 opacity-5"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
					}}
				/>
			</motion.div>

			<SearchHeader
				searchQuery={searchQuery}
				onSearchChange={(query) => setSearchQuery({ activeCategory, query })} />

			<HeroBanner latestData={latestData.data.items} />

			<div className="relative z-10 max-w-450 mx-auto px-6 mt-20">
				<CategoryNav
					activeCategory={activeCategory}
					onCategoryChange={(value) => setSearchQuery({ activeCategory: value, query: searchQuery })}
				/>
			</div>

			{showSearchResults ? (
				searchLoading ? (
					<SearchResultsSkeleton />
				) : searchItems.length === 0 ? (
					<SearchResultsEmpty query={searchQuery} />
				) : (
					<SearchResultsList movies={searchItems} />
				)
			) : (
				<div className="relative z-10 space-y-12 pb-10 mt-5">
					{latestMovies.length > 0 && (
						<MovieCarousel
							title="Latest Releases"
							subtitle="Fresh from the cinema"
							movies={latestMovies}
							variant="featured"
						/>
					)}

					{trendingMovies.length > 0 && (
						<MovieCarousel
							title="Trending"
							subtitle="Popular this week"
							movies={trendingMovies}
							variant="standard"
						/>
					)}

					{topRated.length > 0 && (
						<MovieCarousel
							title="Top Rated"
							subtitle="Highest rated by critics and audiences"
							movies={topRated}
							variant="standard"
						/>
					)}

					{popularSeries.length > 0 && (
						<MovieCarousel
							title="Popular Series"
							subtitle="Binge-worthy shows everyone's talking about"
							movies={popularSeries}
							variant="standard"
						/>
					)}

					{animation.length > 0 && (
						<MovieCarousel
							title="Animation"
							subtitle="Animated masterpieces for all ages"
							movies={animation}
							variant="standard"
						/>
					)}

					{recommended.length > 0 && (
						<MovieCarousel
							title="Recommended For You"
							subtitle="Based on your viewing history"
							movies={recommended}
							variant="personalized"
						/>
					)}
				</div>
			)}
		</div>
	);
}

