import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/domains/discovery/discovery.domain";

export const Route = createFileRoute("/(home)/discovery")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Discovery />;
}
