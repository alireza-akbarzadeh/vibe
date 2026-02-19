import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(admin)/dashboard/music/artists/$artistId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(admin)/dashboard/music/artists/$artistId"!</div>;
}
