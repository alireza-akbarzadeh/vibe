import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLazySection } from "@/hooks/useLazySection";
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
import { searchSuggestionsQueryOptions } from "./movies.queries";



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


	const { data: latestData } = useSuspenseQuery(
		orpc.content.latestReleases.queryOptions({
			input: { type: "MOVIE", limit: 15 },
		}),
	);

	const { data: trendingData } = useQuery({
		...orpc.recommendations.trending.queryOptions({
			input: { type: "MOVIE", limit: 15, days: 7 },
		}),
		enabled: trendingSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const { data: topRatedData } = useQuery({
		...orpc.recommendations.topRated.queryOptions({
			input: { type: "MOVIE", limit: 15 },
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
			input: { type: "MOVIE", limit: 15 },
		}),
		enabled: topIMDBSection.isVisible,
		staleTime: 5 * 60 * 1000,
	});

	const latestMovies: MediaList[] = latestData?.data?.items ?? [];
	const trendingMovies: MediaList[] = trendingData?.data?.items ?? [];
	const topRated: MediaList[] = topRatedData?.data?.items ?? [];
	const popularSeries: MediaList[] = popularSeriesData?.data?.items ?? [];
	const animation: MediaList[] = animationsData?.data?.items ?? [];
	const tvSeries: MediaList[] = tvSeriesData?.data?.items ?? [];
	const horror: MediaList[] = horrorData?.data?.items ?? [];
	const comedy: MediaList[] = comedyData?.data?.items ?? [];
	const romance: MediaList[] = romanceData?.data?.items ?? [];
	const topIMDB: MediaList[] = topIMDBData?.data?.items ?? [];
	const recommended: MediaList[] = [...latestMovies, ...trendingMovies, ...topRated]
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
							sectionSlug="latest-releases"
						/>
					)}
					<div ref={trendingSection.ref} className="min-h-[400px]">
						{trendingMovies.length > 0 && (
							<MovieCarousel
								title="Trending Now"
								subtitle="What's popular this week"
								movies={trendingMovies}
								variant="standard"
								sectionSlug="trending-now"
							/>
						)}
					</div>
					<div ref={topRatedSection.ref} className="min-h-[400px]">
						{topRated.length > 0 && (
							<MovieCarousel
								title="Top Rated"
								subtitle="Highest rated by critics and audiences"
								movies={topRated}
								variant="standard"
								sectionSlug="top-rated"
							/>
						)}
					</div>

					<div ref={popularSeriesSection.ref} className="min-h-[400px]">
						{popularSeries.length > 0 && (
							<MovieCarousel
								title="Popular Series"
								subtitle="Binge-worthy shows everyone's talking about"
								movies={popularSeries}
								variant="standard"
								sectionSlug="popular-series"
							/>
						)}
					</div>

					<div ref={animationsSection.ref} className="min-h-[400px]">
						{animation.length > 0 && (
							<MovieCarousel
								title="Animation"
								subtitle="Animated masterpieces for all ages"
								movies={animation}
								variant="standard"
								sectionSlug="animation"
							/>
						)}
					</div>

					<div ref={tvSeriesSection.ref} className="min-h-[400px]">
						{tvSeries.length > 0 && (
							<MovieCarousel
								title="TV Series"
								subtitle="Binge-worthy episodes and seasons"
								movies={tvSeries}
								variant="standard"
								sectionSlug="tv-series"
							/>
						)}
					</div>

					<div ref={horrorSection.ref} className="min-h-[400px]">
						{horror.length > 0 && (
							<MovieCarousel
								title="Horror"
								subtitle="Spine-chilling thrills and scares"
								movies={horror}
								variant="standard"
								sectionSlug="horror"
							/>
						)}
					</div>
					<div ref={comedySection.ref} className="min-h-[400px]">
						{comedy.length > 0 && (
							<MovieCarousel
								title="Comedy"
								subtitle="Laugh out loud moments"
								movies={comedy}
								variant="standard" sectionSlug="comedy" />
						)}
					</div>
					<div ref={romanceSection.ref} className="min-h-[400px]">
						{romance.length > 0 && (
							<MovieCarousel
								title="Romance"
								subtitle="Heartwarming love stories"
								movies={romance}
								variant="standard"
								sectionSlug="romance"
							/>
						)}
					</div>
					<div ref={topIMDBSection.ref} className="min-h-[400px]">
						{topIMDB.length > 0 && (
							<MovieCarousel
								title="Top IMDB Rated"
								subtitle="Highest rated films of all time"
								movies={topIMDB}
								variant="standard"
								sectionSlug="top-imdb-rated"
							/>
						)}
					</div>

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

