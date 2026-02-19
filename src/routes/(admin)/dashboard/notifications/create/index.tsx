import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(admin)/dashboard/notifications/create/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(admin)/dashboard/notifications/create/"!</div>;
}
