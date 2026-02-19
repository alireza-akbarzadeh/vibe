import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/support")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(home)/support"!</div>;
}
