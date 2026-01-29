import { createFileRoute } from "@tanstack/react-router";
import BackButton from "@/components/back-button";
import MovieDetails from "@/domains/movies/movies-details.domain";
export const Route = createFileRoute("/(home)/movies/$movieId")({
	component: MovieRouteComponent,
});

function MovieRouteComponent() {
	return (
		<>
			<BackButton />
			<MovieDetails />
		</>
	);
}
