import { useSuspenseQuery } from "@tanstack/react-query";
import { VIDEOS } from "@/constants/media";
import {
	movieCastQueryOptions,
	movieDetailsQueryOptions,
	movieImagesQueryOptions,
	movieReviewsQueryOptions,
	movieSimilarQueryOptions,
	movieVideosQueryOptions,
} from "@/domains/movies/movies-details.queries";

export function useMovieDetails(movieId: string) {
	// Fetch all data
	const { data: media } = useSuspenseQuery(movieDetailsQueryOptions(movieId));
	const { data: cast } = useSuspenseQuery(movieCastQueryOptions(movieId));
	const { data: videos } = useSuspenseQuery(movieVideosQueryOptions(movieId));
	const { data: images } = useSuspenseQuery(movieImagesQueryOptions(movieId));
	const { data: reviews } = useSuspenseQuery(movieReviewsQueryOptions(movieId));

	const transformedReviews = reviews
		? {
				...reviews,
				items: reviews.items.map((review) => ({
					...review,
					title: null,
					content: review.review || "",
				})),
			}
		: undefined;

	const genreIds = media.genres?.map((g) => g.genre.id) || [];

	const { data: similarMovies } = useSuspenseQuery(
		movieSimilarQueryOptions(movieId, genreIds),
	);

	const movieData = {
		id: media.id,
		title: media.title,
		year: media.releaseYear,
		poster: media.thumbnail,
		backdrop: images?.backdrops[0]?.filePath
			? `https://image.tmdb.org/t/p/w1280${images.backdrops[0].filePath}`
			: media.thumbnail,
		rating: media.averageRating || media.rating || 0,
		votes: media.reviewCount || reviews?.pagination.total || 0,
		duration: media.duration,
		releaseDate: new Date().toISOString(),
		rating_label: "PG-13",
		genres: media.genres?.map((g) => g.genre.name) || [],
		synopsis: media.description,
		director: cast?.directors[0]?.person.name || "Unknown",
		writers: cast?.writers.map((w) => w.person.name) || [],
		stars: cast?.actors.map((a) => a.person.name) || [],
		productionCo: "N/A",
		budget: "N/A",
		revenue: "TBD",
		trailerUrl: videos?.trailers[0]?.key
			? `https://www.youtube.com/embed/${videos.trailers[0].key}`
			: "",
		metascore: Math.round((media.averageRating || media.rating || 0) * 10),
		popularity: media.viewCount || 0,
		popularityChange: 0,
		description: media.description,
		releaseYear: media.releaseYear,
		reviewCount: media.reviewCount || reviews?.pagination.total || 0,
		viewCount: media.viewCount || 0,
	};

	const videoData = {
		videoId: media.id,
		src: media.videoUrl || VIDEOS.demo,
		videoPoster: media.thumbnail,
		year: media.releaseYear.toString(),
		totalTime: `${Math.floor(media.duration / 60)}h ${media.duration % 60}m`,
		videoName: media.title,
	};

	return {
		media,
		cast,
		videos,
		images,
		reviews: transformedReviews,
		similarMovies,
		movieData,
		videoData,
	};
}
