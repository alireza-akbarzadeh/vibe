import { createFileRoute } from "@tanstack/react-router";
import { AdminCustomersPage } from "@/domains/dashboard/container/admin-customers-page";

export const Route = createFileRoute("/(admin)/dashboard/customers/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AdminCustomersPage />;
}
