import { Search } from "lucide-react";
import { SEARCH_RESULTS_MIN_HEIGHT } from "../../movies";

export function SearchResultsEmpty({ query }: { query: string }) {
	return (
		<div
			className="relative z-10 max-w-450 mx-auto px-6 py-12 flex flex-col items-center justify-center text-center"
			style={{ minHeight: SEARCH_RESULTS_MIN_HEIGHT }}
		>
			<Search className="w-16 h-16 text-gray-500 mb-4" />
			<h2 className="text-xl font-semibold text-white mb-2">
				No results found
			</h2>
			<p className="text-gray-400 max-w-sm">
				We couldn't find anything for "{query}". Try a different search term.
			</p>
		</div>
	);
}
