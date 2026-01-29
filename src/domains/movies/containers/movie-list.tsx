import { MovieCard } from "@/domains/movies/components/movie-card";
import type { ContinueWatching } from "@/types/app";
import type { Categories } from "../movies";

interface MoviesListProps {
	movies: ContinueWatching[];
	activeCategory: Categories;
}
export function MoviesList(props: MoviesListProps) {
	const { movies } = props;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mt-30">
			{movies?.map((movie, index) => (
				<MovieCard
					key={movie.id}
					movie={movie}
					index={index}
					showProgress={true}
					variant={"featured"}
				/>
			))}
		</div>
	);
}
