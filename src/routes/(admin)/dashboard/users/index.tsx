import { createFileRoute } from "@tanstack/react-router";
import UserManagementPage from "@/domains/users/containers/user-management-page";

export const Route = createFileRoute("/(admin)/dashboard/users/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <UserManagementPage />;
}
