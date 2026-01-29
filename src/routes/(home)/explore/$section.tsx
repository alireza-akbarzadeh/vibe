import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SearchHeader } from "@/domains/movies/components";
import { MoviesList } from "@/domains/movies/containers/movie-list";
import { allMovies } from "@/domains/movies/data";

export const Route = createFileRoute("/(home)/explore/$section")({
	component: RouteComponent,
	loader: () => allMovies,
});

function RouteComponent() {
	const movies = Route.useLoaderData();
	const [searchQuery, setSearchQuery] = useState("");
	const flatMovies = movies.flat();
	return (
		<div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
			<SearchHeader
				title="explore"
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>
			<MoviesList activeCategory="animation" movies={flatMovies} />
		</div>
	);
}
