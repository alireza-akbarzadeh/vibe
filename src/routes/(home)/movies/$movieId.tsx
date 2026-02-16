import { createFileRoute } from "@tanstack/react-router";
import BackButton from "@/components/back-button";
import MovieDetails from "@/domains/movies/movies-details.domain";
import {
	movieCastQueryOptions,
	movieDetailsQueryOptions,
	movieImagesQueryOptions,
	movieReviewsQueryOptions,
	movieSimilarQueryOptions,
	movieVideosQueryOptions,
} from "@/domains/movies/movies-details.queries";

export const Route = createFileRoute("/(home)/movies/$movieId")({
	loader: async ({ context, params }) => {
		const { movieId } = params;

		// First, fetch media data to get genre IDs (CRITICAL)
		const mediaData = await context.queryClient.ensureQueryData(
			movieDetailsQueryOptions(movieId),
		);

		// Extract genre IDs for similar movies
		const genreIds = mediaData.genres?.map((g) => g.genre.id) || [];

		// Prefetch all remaining data in parallel (NON-CRITICAL - don't crash the whole page)
		await Promise.allSettled([
			context.queryClient.ensureQueryData(movieCastQueryOptions(movieId)),
			context.queryClient.ensureQueryData(movieVideosQueryOptions(movieId)),
			context.queryClient.ensureQueryData(movieImagesQueryOptions(movieId)),
			context.queryClient.ensureQueryData(movieReviewsQueryOptions(movieId)),
			context.queryClient.ensureQueryData(
				movieSimilarQueryOptions(movieId, genreIds),
			),
		]);
	},
	component: MovieRouteComponent,
});

function MovieRouteComponent() {
	const { movieId } = Route.useParams();

	return (
		<>
			<BackButton />
			<MovieDetails movieId={movieId} />
		</>
	);
}
