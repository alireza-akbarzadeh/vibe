import type { MediaList } from "@/orpc/models/media.schema";

import { SEARCH_RESULTS_MIN_HEIGHT } from "../../movies";
import { MovieCard } from "../movie-card";

export function SearchResultsList({ movies }: { movies: MediaList[] }) {
	return (
		<div
			className="relative z-10 max-w-450 mx-auto px-6 py-8"
			style={{ minHeight: SEARCH_RESULTS_MIN_HEIGHT }}
		>
			<h2 className="text-2xl font-bold text-white mb-6">Search results</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{movies.map((movie, index) => (
					<MovieCard
						key={movie.id}
						movie={movie}
						index={index}
						showProgress={false}
						variant="standard"
					/>
				))}
			</div>
		</div>
	);
}
