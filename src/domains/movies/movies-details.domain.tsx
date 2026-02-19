import { useRef, useState } from "react";
import { VideoPlayer } from "@/components/video-payler/video-player";
import { useMovieDetails } from "@/hooks/use-movie-details";
import {
	MovieDetailsSection,
	MovieHero,
	ReviewsSection,
	SimilarMovies,
	TrailerPlayer,
} from "./components";
import { CastAndCrew, ImagesGallery, StatsBar, Synopsis } from "./containers";

interface MovieDetailsProps {
	movieId: string;
}

export default function MovieDetails({ movieId }: MovieDetailsProps) {
	const { cast, images, reviews, similarMovies, movieData, videoData } =
		useMovieDetails(movieId);

	const [watchMode, setWatchMovie] = useState<"movie" | "trailer">("trailer");
	const modeRef = useRef<HTMLDivElement>(null);

	const onModeChange = (mode: "trailer" | "movie") => {
		modeRef.current?.scrollIntoView();
		setWatchMovie(mode);
	};

	return (
		<div className="bg-[#0a0a0a] min-h-screen">
			<MovieHero onClick={onModeChange} movie={movieData} />
			<div className="py-12 space-y-16">
				<div ref={modeRef} className="-my-12 py-12">
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
				<MovieDetailsSection movie={movieData} />
				<CastAndCrew cast={cast} />
				<ReviewsSection reviews={reviews} mediaId={movieId} />
				<ImagesGallery images={images} />
				<SimilarMovies movies={similarMovies?.items} />
			</div>
		</div>
	);
}
