import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(admin)/dashboard/media/uploads/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(admin)/dashboard/media/uploads/"!</div>;
}
