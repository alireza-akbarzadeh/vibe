/** biome-ignore-all lint/suspicious/noArrayIndexKey: static skeleton items don't need unique keys */
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
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

export interface MobileSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function MobileSearch({
    searchQuery,
    onSearchChange,
}: MobileSearchProps) {
    const [inputValue, setInputValue] = useState(() => searchQuery ?? "");
    const lastSentRef = useRef<string>(searchQuery ?? "");
    const onSearchChangeRef = useRef(onSearchChange);
    onSearchChangeRef.current = onSearchChange;

    const trimmedInput = inputValue.trim();
    const [debouncedSearchTerm] = useDebouncedValue(
        trimmedInput,
        SEARCH_DEBOUNCE_MS,
    );

    useEffect(() => {
        const fromUrl = searchQuery ?? "";
        setInputValue(fromUrl);
        lastSentRef.current = fromUrl;
    }, [searchQuery]);

    useEffect(() => {
        if (trimmedInput === lastSentRef.current) return;
        lastSentRef.current = trimmedInput;
        onSearchChangeRef.current(trimmedInput || "");
    }, [trimmedInput]);

    const showSearchSection = debouncedSearchTerm.length >= MIN_QUERY_LENGTH;

    const { data: trendingData, isLoading: trendingLoading } = useQuery({
        ...trendingSearchesQueryOptions(10),
        enabled: !showSearchSection,
    });

    const { data: searchData, isFetching: searchFetching } = useQuery({
        ...searchSuggestionsQueryOptions(
            debouncedSearchTerm
                ? { search: debouncedSearchTerm, limit: 10 }
                : { search: "", limit: 0 },
        ),
        enabled: showSearchSection,
    });

    const trendingItems: MediaList[] = trendingData?.data?.items ?? [];
    const searchItems: MediaList[] = searchData?.data?.items ?? [];

    const handleClear = () => {
        setInputValue("");
        lastSentRef.current = "";
        onSearchChange("");
    };

    return (
        <div className="flex flex-col h-full">
            {/* Search Input - Mobile Optimized */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search movies, series..."
                    className="pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-2xl transition-all text-base"
                    autoComplete="off"
                    autoFocus
                />
                {inputValue ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                ) : null}
            </div>

            {/* Results Section */}
            <div className="flex-1 overflow-y-auto -mx-4">
                {showSearchSection ? (
                    <div>
                        <div className="flex items-center gap-2 px-4 py-3 sticky top-0 bg-black/95 backdrop-blur-xl border-b border-white/10">
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
                        <div className="p-2">
                            {searchFetching && searchItems.length === 0 ? (
                                <div className="space-y-1">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <SuggestionItemSkeleton key={i} />
                                    ))}
                                </div>
                            ) : searchItems.length === 0 ? (
                                <div className="px-4 py-12 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                        <Search className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-400 text-base mb-1">No results found</p>
                                    <p className="text-gray-600 text-sm">
                                        Try searching with different keywords
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {searchItems.map((item) => (
                                        <SuggestionItem key={item.id} item={item} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-2 px-4 py-3 sticky top-0 bg-black/95 backdrop-blur-xl border-b border-white/10">
                            <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="text-sm font-semibold text-white">
                                Trending Now
                            </span>
                        </div>
                        <div className="p-2">
                            {trendingLoading ? (
                                <div className="space-y-1">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <SuggestionItemSkeleton key={i} />
                                    ))}
                                </div>
                            ) : trendingItems.length === 0 ? (
                                <div className="px-4 py-12 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-400 text-base">No trending items</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {trendingItems.map((item) => (
                                        <SuggestionItem key={item.id} item={item} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
