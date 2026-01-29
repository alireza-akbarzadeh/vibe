import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/community")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(home)/community"!</div>;
}
