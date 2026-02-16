import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { CategoryVariant } from "@/domains/movies/components/category-nav";
import MovieDiscovery from "@/domains/movies/movies";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/(home)/movies/")({
	validateSearch: (search: Record<string, unknown>): MovieSearchQuery => ({
		query: typeof search.query === "string" ? search.query : undefined,
		activeCategory: (search.activeCategory as CategoryVariant) || "all",
	}),
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(
				orpc.content.latestReleases.queryOptions({
					input: { type: "MOVIE", limit: 15 },
				}),
			),
			context.queryClient.ensureQueryData(
				orpc.recommendations.trending.queryOptions({
					input: { type: "MOVIE", limit: 15, days: 7 },
				}),
			),
		]);
	},
	component: RouteComponent,
});

export type MovieSearchQuery = { query?: string, activeCategory?: CategoryVariant }

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = useNavigate();

	const handleSearchChange = async (next: {
		query?: string;
		activeCategory?: CategoryVariant;
	}) => {
		await navigate({
			to: ".",
			search: {
				query: next.query?.trim() || undefined,
				activeCategory: next.activeCategory ?? "all",
			},
			replace: true,
			resetScroll: false,
		});
	};

	return (
		<MovieDiscovery
			query={search}
			onSearchChange={handleSearchChange}
		/>
	);
}
