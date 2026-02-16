import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MovieCard } from "@/domains/movies/components/movie-card";
import {
	getSectionInfiniteQueryOptions,
	SECTION_CONFIG,
	type SectionSlug,
} from "@/domains/movies/explore.queries";
import type { MediaList } from "@/orpc/models/media.schema";

export const Route = createFileRoute("/(home)/explore/$section")({
	component: RouteComponent,
});

function RouteComponent() {
	const { section } = Route.useParams();
	const sectionSlug = section.toLowerCase() as SectionSlug;
	const config = SECTION_CONFIG[sectionSlug];

	const loadMoreRef = useRef<HTMLDivElement>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useInfiniteQuery(getSectionInfiniteQueryOptions(sectionSlug, 20, debouncedSearch));

	useEffect(() => {
		if (!loadMoreRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(loadMoreRef.current);

		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const allMovies: MediaList[] =
		data?.pages.flatMap((page) => {
			const typedPage = page as unknown as { data: { items: MediaList[] } };
			return typedPage?.data?.items || [];
		}) ?? [];

	// Filter movies based on search query is now handled by the API
	const filteredMovies = allMovies;

	if (!config) {
		return (
			<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white mb-4">
						Section not found
					</h1>
					<Link to="/movies">
						<Button>Go back to movies</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
			{/* Background effects */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute inset-0 bg-linear-to-b from-purple-900/10 via-black to-black" />
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-30" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl opacity-20" />
			</div>

			{/* Header */}
			<div className="relative z-10 max-w-450 mx-auto px-6 py-8">
				<Link to="/movies">
					<Button
						variant="ghost"
						className="mb-6 text-gray-400 hover:text-white"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Back to Movies
					</Button>
				</Link>

				<div className="mb-8">
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
						{config.title}
					</h1>
					<p className="text-xl text-gray-400 mb-6">{config.subtitle}</p>

					{/* Search Input */}
					<div className="relative max-w-xl">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<Input
							type="text"
							placeholder={`Search in ${config.title}...`}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
						/>
						{searchQuery && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSearchQuery("")}
								className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
							>
								<X className="w-4 h-4" />
							</Button>
						)}
					</div>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{Array.from({ length: 20 }, (_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders don't need stable keys
								key={`skeleton-${sectionSlug}-${i}`}
								className="aspect-2/3 bg-white/10 rounded-xl animate-pulse"
							/>
						))}
					</div>
				) : isError ? (
					<div className="text-center py-20">
						<p className="text-red-400 text-lg">Failed to load movies</p>
						{error && (
							<p className="text-red-300 text-sm mt-2">
								{error instanceof Error ? error.message : String(error)}
							</p>
						)}
						<Button
							onClick={() => window.location.reload()}
							className="mt-4"
						>
							Try again
						</Button>
					</div>
				) : filteredMovies.length === 0 ? (
					<div className="text-center py-20">
						{searchQuery ? (
							<>
								<p className="text-gray-400 text-lg mb-2">
									No results found for "{searchQuery}"
								</p>
								<p className="text-gray-500 text-sm">
									Try a different search term
								</p>
							</>
						) : (
							<p className="text-gray-400 text-lg">No movies found</p>
						)}
					</div>
				) : (
					<>
						{searchQuery && (
							<p className="text-gray-400 text-sm mb-4">
								Found {filteredMovies.length} result
								{filteredMovies.length !== 1 ? "s" : ""}
							</p>
						)}
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
							{filteredMovies.map((movie, index) => (
								<MovieCard
									key={movie.id}
									movie={movie}
									variant="standard"
									index={index}
									showProgress={false}
								/>
							))}
						</div>

						{/* Load more trigger - only show when not searching */}
						{!searchQuery && (
							<div ref={loadMoreRef} className="py-8 text-center">
								{isFetchingNextPage ? (
									<div className="flex items-center justify-center gap-2 text-purple-400">
										<Loader2 className="w-6 h-6 animate-spin" />
										<span>Loading more...</span>
									</div>
								) : hasNextPage ? (
									<Button
										onClick={() => fetchNextPage()}
										variant="outline"
										className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
									>
										Load more
									</Button>
								) : (
									<p className="text-gray-500">
										You've reached the end
									</p>
								)}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
