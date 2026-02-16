import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Info, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CastCarousel } from "../containers/cast-carousel.tsx";
import { ImagesGallery } from "../containers/image-gallery";
import { StatsBar } from "../containers/stats-bar.tsx";
import { Synopsis } from "../containers/synopsis.tsx";
import {
	movieCastQueryOptions,
	movieDetailsQueryOptions,
	movieImagesQueryOptions,
	movieReviewsQueryOptions,
	movieSimilarQueryOptions,
	movieVideosQueryOptions,
} from "../movies-details.queries";
import MovieInfo from "./movie-info";
import { ReviewsSection } from "./reviews-section";
import { SimilarMovies } from "./similar-movies";

interface MovieInfoDialogProps {
	mediaId: string;
	triggerButton?: ReactNode;
}

function MovieInfoContent({ mediaId }: { mediaId: string }) {
	// Fetch all data
	const { data: media } = useSuspenseQuery(movieDetailsQueryOptions(mediaId));
	const { data: cast } = useSuspenseQuery(movieCastQueryOptions(mediaId));
	const { data: videos } = useSuspenseQuery(movieVideosQueryOptions(mediaId));
	const { data: images } = useSuspenseQuery(movieImagesQueryOptions(mediaId));
	const { data: reviews } = useSuspenseQuery(
		movieReviewsQueryOptions(mediaId),
	);

	const genreIds = media.genres?.map((g) => g.genre.id) || [];
	const { data: similarMovies } = useQuery(
		movieSimilarQueryOptions(mediaId, genreIds),
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
		description: media.description,
		releaseYear: media.releaseYear,
		reviewCount: media.reviewCount || reviews?.pagination.total || 0,
		viewCount: media.viewCount || 0,
	};

	return (
		<div className="space-y-8">
			<MovieInfo
				component="dialog"
				showBreadCrumb={false}
				movie={movieData}
			/>
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
			<ReviewsSection reviews={transformedReviews} mediaId={mediaId} />
			<ImagesGallery images={images} />
			<SimilarMovies movies={similarMovies?.items} />
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Hero skeleton */}
			<div className="space-y-4">
				<Skeleton className="h-12 w-3/4 bg-white/10" />
				<Skeleton className="h-6 w-1/4 bg-white/10" />
				<Skeleton className="h-24 w-full bg-white/10" />
				<div className="flex gap-2">
					<Skeleton className="h-12 w-32 bg-white/10" />
					<Skeleton className="h-12 w-32 bg-white/10" />
					<Skeleton className="h-12 w-12 rounded-full bg-white/10" />
				</div>
			</div>

			{/* Stats skeleton */}
			<div className="grid grid-cols-3 gap-4">
				<Skeleton className="h-20 bg-white/10" />
				<Skeleton className="h-20 bg-white/10" />
				<Skeleton className="h-20 bg-white/10" />
			</div>

			{/* Content skeleton */}
			<div className="space-y-4">
				<Skeleton className="h-8 w-48 bg-white/10" />
				<Skeleton className="h-32 w-full bg-white/10" />
			</div>
		</div>
	);
}

export function MovieInfoDialog(props: MovieInfoDialogProps) {
	const { mediaId, triggerButton } = props;

	return (
		<Dialog>
			<DialogTrigger asChild>
				{triggerButton || (
					<Button
						size="sm"
						variant="ghost"
						className="w-10 h-10 p-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-lg group"
					>
						<Info className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto bg-linear-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-white/10">
				<Suspense
					fallback={
						<div className="flex items-center justify-center py-12">
							<div className="text-center space-y-4">
								<Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
								<p className="text-gray-400">Loading movie details...</p>
								<LoadingSkeleton />
							</div>
						</div>
					}
				>
					<MovieInfoContent mediaId={mediaId} />
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}
