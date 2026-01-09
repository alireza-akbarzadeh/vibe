import { useRef, useState } from "react";
import { VideoPlayer } from "@/components/video-payler/video-player";
import { VIDEOS } from "@/constants/media";
import {
	CastCarousel,
	ImagesGallery,
	MovieHero,
	ReviewsSection,
	SimilarMovies,
	StatsBar,
	Synopsis,
	TrailerPlayer,
} from "./components";
import { movieData } from "./data";

export default function MovieDetails() {
	const [watchMode, setWatchMovie] = useState<"movie" | "trailer">("trailer")
	const modeRef = useRef<HTMLDivElement>(null)


	const videoData = { src: VIDEOS.demo, videoPoster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop", year: "2014", totalTime: "2:49:00", videoName: "Interstellar" }

	const onModeChange = (mode: "trailer" | "movie") => {
		modeRef.current?.scrollIntoView()
		setWatchMovie(mode)
	}
	return (
		<div className="bg-[#0a0a0a] min-h-screen">
			<MovieHero onClick={onModeChange} movie={movieData} />
			<div ref={modeRef}>
				{watchMode === "trailer" && (
					<TrailerPlayer trailerUrl={movieData.trailerUrl} />
				)}
				{watchMode === "movie" && (
					<VideoPlayer {...videoData} />
				)}
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
			<CastCarousel movieId={movieData.id} />
			<ReviewsSection movieId={movieData.id} />
			<ImagesGallery movieId={movieData.id} />
			<SimilarMovies movieId={movieData.id} />
		</div>
	);
}
