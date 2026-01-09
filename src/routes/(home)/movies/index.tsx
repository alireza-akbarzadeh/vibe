import { createFileRoute } from "@tanstack/react-router";
import MovieDiscovery from "@/domains/movies/movies";

export const Route = createFileRoute("/(home)/movies/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <MovieDiscovery />;
}
