import { useLogger } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import MovieDiscovery from "@/domains/movies/movies";
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/(home)/movies/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(
			orpc.media.list.queryOptions({
				input: {
					status: ["PUBLISHED"],
				},
			}),
		)
	},
});

function RouteComponent() {
	const { data } = useQuery(
		orpc.media.list.queryOptions({
			input: {
				status: ["PUBLISHED"],
			},
		}),
	)
	useLogger("Movies Page data:", [data]);

	return <MovieDiscovery />;
}
