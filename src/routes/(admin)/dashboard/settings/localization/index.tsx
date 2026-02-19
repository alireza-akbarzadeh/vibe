import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(admin)/dashboard/settings/localization/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(admin)/dashboard/setting/localization/"!</div>;
}
