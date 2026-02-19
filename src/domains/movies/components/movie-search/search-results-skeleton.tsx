import { SEARCH_RESULTS_MIN_HEIGHT } from "../../movies";

export function SearchResultsSkeleton() {
	return (
		<div
			className="relative z-10 max-w-450 mx-auto px-6 py-8"
			style={{ minHeight: SEARCH_RESULTS_MIN_HEIGHT }}
			aria-busy="true"
			aria-label="Loading search results"
		>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{Array.from({ length: 10 }).map((_, i) => (
					<div
						key={i}
						className="rounded-2xl overflow-hidden bg-white/5 animate-pulse"
						style={{ aspectRatio: "280/420" }}
					/>
				))}
			</div>
		</div>
	);
}
