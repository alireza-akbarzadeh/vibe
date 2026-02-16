/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Search, TrendingUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	searchSuggestionsQueryOptions,
	trendingSearchesQueryOptions,
} from "@/domains/movies/movies.queries";
import type { MediaList } from "@/orpc/models/media.schema";
import { SuggestionItem, SuggestionItemSkeleton } from "./suggestion-item";

const SEARCH_DEBOUNCE_MS = 450;
const MIN_QUERY_LENGTH = 2;

export interface MoviesSearchInputProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	autoFocus?: boolean;
}

export function MoviesSearchInput({
	searchQuery,
	onSearchChange,
	autoFocus = false,
}: MoviesSearchInputProps) {
	const [isFocused, setIsFocused] = useState(false);
	const [inputValue, setInputValue] = useState(() => searchQuery ?? "");
	const lastSentRef = useRef<string>(searchQuery ?? "");
	const onSearchChangeRef = useRef(onSearchChange);
	onSearchChangeRef.current = onSearchChange;

	const trimmedInput = inputValue.trim();
	// Debounce only for API calls, not for URL updates
	const [debouncedSearchTerm] = useDebouncedValue(trimmedInput, SEARCH_DEBOUNCE_MS);

	useEffect(() => {
		const fromUrl = searchQuery ?? "";
		setInputValue(fromUrl);
		lastSentRef.current = fromUrl;
	}, [searchQuery]);

	// Update URL immediately on input change (no debounce)
	useEffect(() => {
		if (trimmedInput === lastSentRef.current) return;
		lastSentRef.current = trimmedInput;
		onSearchChangeRef.current(trimmedInput || "");
	}, [trimmedInput]);

	const showSearchSection = debouncedSearchTerm.length >= MIN_QUERY_LENGTH;

	const { data: trendingData, isLoading: trendingLoading } = useQuery({
		...trendingSearchesQueryOptions(8),
		enabled: isFocused && !showSearchSection,
	});

	const { data: searchData, isFetching: searchFetching } = useQuery({
		...searchSuggestionsQueryOptions(debouncedSearchTerm ? { search: debouncedSearchTerm, limit: 8 } : { search: "", limit: 0 }),
		enabled: isFocused && showSearchSection,
	});

	const trendingItems: MediaList[] = trendingData?.data?.items ?? [];
	const searchItems: MediaList[] = searchData?.data?.items ?? [];

	const handleClear = () => {
		setInputValue("");
		lastSentRef.current = "";
		onSearchChange("");
	};

	return (
		<div className="relative flex-1 max-w-2xl">
			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setTimeout(() => setIsFocused(false), 200)}
					placeholder="Search movies, series, or actors..."
					className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all"
					autoComplete="off"
					autoFocus={autoFocus}
				/>
				{inputValue ? (
					<Button
						type="button"
						variant="text"
						onClick={handleClear}
						className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
					>
						<X className="w-5 h-5" />
					</Button>
				) : null}
			</div>

			<AnimatePresence>
				{isFocused && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="absolute top-full mt-2 left-0 right-0 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[70vh] flex flex-col z-50"
					>
						{showSearchSection ? (
							<>
								<div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
									<Search className="w-4 h-4 text-purple-400 shrink-0" />
									<span className="text-sm font-semibold text-white">
										Search results
										{searchItems.length > 0 && (
											<span className="text-gray-400 font-normal ml-1">
												({searchItems.length})
											</span>
										)}
									</span>
								</div>
								<div className="overflow-y-auto p-2">
									{searchFetching && searchItems.length === 0 ? (
										<div className="space-y-0.5">
											{Array.from({ length: 5 }).map((_, i) => (
												<SuggestionItemSkeleton key={i} />
											))}
										</div>
									) : searchItems.length === 0 ? (
										<p className="px-3 py-6 text-center text-gray-400 text-sm">
											No results for &quot;{debouncedSearchTerm}&quot;
										</p>
									) : (
										<div className="space-y-0.5">
											{searchItems.map((item) => (
												<SuggestionItem key={item.id} item={item} />
											))}
										</div>
									)}
								</div>
							</>
						) : (
							<>
								<div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
									<TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
									<span className="text-sm font-semibold text-white">
										Trending
									</span>
								</div>
								<div className="overflow-y-auto p-2">
									{trendingLoading ? (
										<div className="space-y-0.5">
											{Array.from({ length: 5 }).map((_, i) => (
												<SuggestionItemSkeleton key={i} />
											))}
										</div>
									) : trendingItems.length === 0 ? (
										<p className="px-3 py-6 text-center text-gray-400 text-sm">
											No trending items
										</p>
									) : (
										<div className="space-y-0.5">
											{trendingItems?.map((item) => (
												<SuggestionItem key={item.id} item={item} />
											))}
										</div>
									)}
								</div>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
