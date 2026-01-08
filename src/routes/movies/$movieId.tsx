import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import MovieDetails from "@/domains/movies/movies-details.domain";

export const Route = createFileRoute("/movies/$movieId")({
	component: MovieRouteComponent,
});

function MovieRouteComponent() {
	return (
		<>
			<RootHeader />
			<MovieDetails />
		</>
	);
}
