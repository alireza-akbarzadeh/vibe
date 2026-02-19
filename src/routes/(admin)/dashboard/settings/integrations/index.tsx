import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(admin)/dashboard/settings/integrations/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(admin)/dashboard/setting/integrations/"!</div>;
}
