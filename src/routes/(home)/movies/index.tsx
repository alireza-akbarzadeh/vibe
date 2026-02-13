import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import MovieDiscovery from "@/domains/movies/movies";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/(home)/movies/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(
				orpc.media.list.queryOptions({
					input: { status: ["PUBLISHED"] },
				}),
			),
			context.queryClient.ensureQueryData(
				orpc.content.latestReleases.queryOptions({
					input: { type: "MOVIE", limit: 10 },
				}),
			),
			context.queryClient.ensureQueryData(
				orpc.content.popularSeries.queryOptions({
					input: { limit: 10 },
				}),
			),
			context.queryClient.ensureQueryData(
				orpc.recommendations.trending.queryOptions({
					input: { type: "MOVIE", limit: 10, days: 7 },
				}),
			),
			context.queryClient.ensureQueryData(
				orpc.recommendations.topRated.queryOptions({
					input: { type: "MOVIE", limit: 10 },
				}),
			),
			context.queryClient.ensureQueryData(
				orpc.content.animations.queryOptions({
					input: { limit: 10 },
				}),
			),
		]);
	},
});

function RouteComponent() {
	const { data } = useSuspenseQuery(
		orpc.media.list.queryOptions({
			input: {
				status: ["PUBLISHED"],
			},
		}),
	);

	// Latest releases
	const { data: latestData } = useSuspenseQuery(
		orpc.content.latestReleases.queryOptions({
			input: {
				type: "MOVIE",
				limit: 10,
			},
		}),
	);

	// Popular series
	const { data: popularSeriesData } = useSuspenseQuery(
		orpc.content.popularSeries.queryOptions({
			input: {
				limit: 10,
			},
		}),
	);

	// Trending movies
	const { data: trendingData } = useSuspenseQuery(
		orpc.recommendations.trending.queryOptions({
			input: {
				type: "MOVIE",
				limit: 10,
				days: 7,
			},
		}),
	);

	// Top rated movies
	const { data: topRatedData } = useSuspenseQuery(
		orpc.recommendations.topRated.queryOptions({
			input: {
				type: "MOVIE",
				limit: 10,
			},
		}),
	);

	// Animations
	const { data: animationsData } = useSuspenseQuery(
		orpc.content.animations.queryOptions({
			input: {
				limit: 10,
			},
		}),
	);

	console.log("📊 API Test Results:");
	console.log("Movies loaded:", data.data.items.length);
	console.log("Latest releases:", latestData.data.items.length);
	console.log("Popular series:", popularSeriesData.data.items.length);
	console.log("Trending movies:", trendingData.data.items.length);
	console.log("Top rated movies:", topRatedData.data.items.length);
	console.log("Animations:", animationsData.data.items.length);

	// Log first item to show all fields including ratings
	if (data.data.items.length > 0) {
		console.log("Sample movie with ratings:");
		console.log({
			title: data.data.items[0].title,
			rating: data.data.items[0].rating,
			reviewCount: data.data.items[0].reviewCount,
			criticalScore: data.data.items[0].criticalScore,
			viewCount: data.data.items[0].viewCount,
		});
	}

	return <MovieDiscovery />;
}
