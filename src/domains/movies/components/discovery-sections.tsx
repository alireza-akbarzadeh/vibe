import { Heart } from "lucide-react";
import type { MediaList } from "@/orpc/models/media.schema";
import { MovieCarousel } from "./movie-carousel";

interface DiscoverySectionsProps {
    activeCategory: string;
    latestMovies: MediaList[];
    myFavorites: MediaList[];
    trendingMovies: MediaList[];
    topRated: MediaList[];
    popularSeries: MediaList[];
    animation: MediaList[];
    tvSeries: MediaList[];
    horror: MediaList[];
    comedy: MediaList[];
    romance: MediaList[];
    topIMDB: MediaList[];
    recommended: MediaList[];
    refs: {
        trending: (instance: HTMLDivElement | null) => void;
        topRated: (instance: HTMLDivElement | null) => void;
        popularSeries: (instance: HTMLDivElement | null) => void;
        animations: (instance: HTMLDivElement | null) => void;
        tvSeries: (instance: HTMLDivElement | null) => void;
        horror: (instance: HTMLDivElement | null) => void;
        comedy: (instance: HTMLDivElement | null) => void;
        romance: (instance: HTMLDivElement | null) => void;
        topIMDB: (instance: HTMLDivElement | null) => void;
        favorites: (instance: HTMLDivElement | null) => void;
    };
}

export function DiscoverySections({
    activeCategory,
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
    refs,
}: DiscoverySectionsProps) {
    return (
        <div className="relative z-10 space-y-12 pb-10 mt-5">
            {(activeCategory === "all" ||
                activeCategory === "recent" ||
                activeCategory === "movies" ||
                activeCategory === "series") &&
                latestMovies.length > 0 && (
                    <MovieCarousel
                        title="Latest Releases"
                        subtitle="Fresh from the cinema"
                        movies={latestMovies}
                        variant="featured"
                        sectionSlug="latest-releases"
                    />
                )}

            {(activeCategory === "all" || activeCategory === "favorites") && (
                <div ref={refs.favorites} className="min-h-100">
                    {myFavorites.length > 0 ? (
                        <MovieCarousel
                            title="My List"
                            subtitle="Your saved movies and shows"
                            movies={myFavorites}
                            variant="standard"
                            sectionSlug="my-list"
                        />
                    ) : (
                        activeCategory === "favorites" && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Heart className="w-16 h-16 text-gray-800 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Your list is empty
                                </h3>
                                <p className="text-gray-500">
                                    Start adding your favorite movies and shows to see them here.
                                </p>
                            </div>
                        )
                    )}
                </div>
            )}

            {(activeCategory === "all" || activeCategory === "trending") && (
                <div ref={refs.trending} className="min-h-100">
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
            )}

            {(activeCategory === "all" ||
                activeCategory === "movies" ||
                activeCategory === "series") && (
                    <div ref={refs.topRated} className="min-h-100">
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
                )}

            {(activeCategory === "all" || activeCategory === "series") && (
                <div ref={refs.popularSeries} className="min-h-100">
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
            )}

            {(activeCategory === "all" || activeCategory === "animation") && (
                <div ref={refs.animations} className="min-h-100">
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
            )}

            {(activeCategory === "all" || activeCategory === "series") && (
                <div ref={refs.tvSeries} className="min-h-100">
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
            )}

            {(activeCategory === "all" || activeCategory === "horror") && (
                <div ref={refs.horror} className="min-h-100">
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
            )}

            {(activeCategory === "all" || activeCategory === "comedy") && (
                <div ref={refs.comedy} className="min-h-100">
                    {comedy.length > 0 && (
                        <MovieCarousel
                            title="Comedy"
                            subtitle="Laugh out loud moments"
                            movies={comedy}
                            variant="standard"
                            sectionSlug="comedy"
                        />
                    )}
                </div>
            )}

            {(activeCategory === "all" || activeCategory === "romantic") && (
                <div ref={refs.romance} className="min-h-100">
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
            )}

            {(activeCategory === "all" ||
                activeCategory === "movies" ||
                activeCategory === "series") && (
                    <div ref={refs.topIMDB} className="min-h-100">
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
                )}

            {activeCategory === "all" && recommended.length > 0 && (
                <MovieCarousel
                    title="Recommended For You"
                    subtitle="Based on your viewing history"
                    movies={recommended}
                    variant="personalized"
                />
            )}
        </div>
    );
}
