import type { MovieSearchQuery } from "@/routes/(home)/movies";
import {
	CategoryNav,
	DiscoveryBackground,
	DiscoverySections,
	HeroBanner,
	SearchHeader,
} from "./components";
import { SearchResultsEmpty } from "./components/movie-search/search-results-empty";
import { SearchResultsList } from "./components/movie-search/search-results-list";
import { SearchResultsSkeleton } from "./components/movie-search/search-results-skeleton";
import { useMovieDiscovery } from "./hooks/use-movie-discovery";



export const SEARCH_RESULTS_MIN_HEIGHT = 420;


export interface MovieDiscoveryProps {
	query?: MovieSearchQuery
	onSearchChange?: (query: MovieSearchQuery) => void;
}

export default function MovieDiscovery(props: MovieDiscoveryProps = {}) {
	const {
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
	} = useMovieDiscovery({
		searchQueryProp: props.query,
		onSearchChange: props.onSearchChange,
	});

	return (
		<div
			ref={containerRef}
			className="min-h-screen bg-[#0a0a0a] relative overflow-hidden"
		>
			<DiscoveryBackground backgroundY={backgroundY} />

			<SearchHeader
				searchQuery={searchQuery}
				onSearchChange={(query) => setSearchQuery({ query })}
			/>

			{latestMovies.length > 0 && <HeroBanner latestData={latestMovies} />}

			<div className="relative z-10 max-w-450 mx-auto px-6 mt-20">
				<CategoryNav />
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
				<DiscoverySections
					activeCategory={activeCategory}
					latestMovies={latestMovies}
					myFavorites={myFavorites}
					trendingMovies={trendingMovies}
					topRated={topRated}
					popularSeries={popularSeries}
					animation={animation}
					tvSeries={tvSeries}
					horror={horror}
					comedy={comedy}
					romance={romance}
					topIMDB={topIMDB}
					recommended={recommended}
					refs={{
						trending: trendingSection.ref,
						topRated: topRatedSection.ref,
						popularSeries: popularSeriesSection.ref,
						animations: animationsSection.ref,
						tvSeries: tvSeriesSection.ref,
						horror: horrorSection.ref,
						comedy: comedySection.ref,
						romance: romanceSection.ref,
						topIMDB: topIMDBSection.ref,
						favorites: favoritesSection.ref,
					}}
				/>
			)}
		</div>
	);
}

