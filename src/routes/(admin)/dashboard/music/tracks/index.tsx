import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(admin)/dashboard/music/tracks/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(admin)/dashboard/music/albums/tracks/"!</div>;
}
