import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(admin)/dashboard/support/$ticketId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(admin)/dashboard/support/$ticketId"!</div>;
}
