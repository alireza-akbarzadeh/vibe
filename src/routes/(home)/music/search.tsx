import { createFileRoute } from "@tanstack/react-router";
import { SearchView } from "@/domains/music/container/search";

export const Route = createFileRoute("/(home)/music/search")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SearchView />;
}
