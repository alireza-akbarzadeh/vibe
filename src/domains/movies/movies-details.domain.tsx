import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { VideoPlayer } from "@/components/video-payler/video-player";
import { VIDEOS } from "@/constants/media";
import {
	MovieHero,
	ReviewsSection,
	SimilarMovies,
	TrailerPlayer,
} from "./components";
import { CastCarousel, ImagesGallery, StatsBar, Synopsis } from "./containers";
import {
	movieCastQueryOptions,
	movieDetailsQueryOptions,
	movieImagesQueryOptions,
	movieReviewsQueryOptions,
	movieSimilarQueryOptions,
	movieVideosQueryOptions,
} from "./movies-details.queries";

interface MovieDetailsProps {
	movieId: string;
}

export default function MovieDetails({ movieId }: MovieDetailsProps) {
	const [watchMode, setWatchMovie] = useState<"movie" | "trailer">("trailer");
	const modeRef = useRef<HTMLDivElement>(null);

	// Fetch all data
	const { data: media } = useSuspenseQuery(movieDetailsQueryOptions(movieId));
	const { data: cast } = useSuspenseQuery(movieCastQueryOptions(movieId));
	const { data: videos } = useSuspenseQuery(movieVideosQueryOptions(movieId));
	const { data: images } = useSuspenseQuery(movieImagesQueryOptions(movieId));
	const { data: reviews } = useSuspenseQuery(
		movieReviewsQueryOptions(movieId),
	);

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
		id: Number.parseInt(media.id) || 0,
		title: media.title,
		year: media.releaseYear,
		poster: media.thumbnail,
		backdrop: images?.backdrops[0]?.filePath
			? `https://image.tmdb.org/t/p/w1280${images.backdrops[0].filePath}`
			: media.thumbnail,
		rating: media.averageRating || media.rating || 0,
		votes: media.reviewCount || reviews?.pagination.total || 0,
		duration: `${Math.floor(media.duration / 60)}h ${media.duration % 60}m`,
		releaseDate: new Date().toISOString(),
		rating_label: "PG-13",
		genres: media.genres?.map((g) => g.genre.name) || [],
		synopsis: media.description,
		director: cast?.directors[0]?.person.name || "Unknown",
		writers: cast?.writers.map((w) => w.person.name) || [],
		stars: cast?.actors.slice(0, 3).map((a) => a.person.name) || [],
		productionCo: "N/A",
		budget: "N/A",
		revenue: "TBD",
		trailerUrl: videos?.trailers[0]?.key
			? `https://www.youtube.com/embed/${videos.trailers[0].key}`
			: "",
		metascore: Math.round((media.averageRating || media.rating || 0) * 10),
		popularity: media.viewCount || 0,
		popularityChange: 0,
	};

	const videoData = {
		videoId: media.id,
		src: media.videoUrl || VIDEOS.demo,
		videoPoster: media.thumbnail,
		year: media.releaseYear.toString(),
		totalTime: movieData.duration,
		videoName: media.title,
	};

	const onModeChange = (mode: "trailer" | "movie") => {
		modeRef.current?.scrollIntoView();
		setWatchMovie(mode);
	};

	return (
		<div className="bg-[#0a0a0a] min-h-screen">
			<MovieHero onClick={onModeChange} movie={movieData} />
			<div ref={modeRef}>
				{watchMode === "trailer" && movieData.trailerUrl && (
					<TrailerPlayer trailerUrl={movieData.trailerUrl} />
				)}
				{watchMode === "movie" && <VideoPlayer {...videoData} />}
			</div>
			<StatsBar
				rating={movieData.rating}
				votes={movieData.votes}
				metascore={movieData.metascore}
				popularity={movieData.popularity}
				popularityChange={movieData.popularityChange}
				revenue={movieData.revenue}
			/>
			<Synopsis movie={movieData} />
			<CastCarousel cast={cast} />
			<ReviewsSection reviews={transformedReviews} mediaId={movieId} />
			<ImagesGallery images={images} />
			<SimilarMovies movies={similarMovies?.items} />
		</div>
	);
}
