import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.auth) {
			throw redirect({
				to: "/",
			});
		}
	},
});

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
