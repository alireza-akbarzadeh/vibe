import { createFileRoute } from "@tanstack/react-router";
import { AdminSubscriptionsPage } from "@/domains/dashboard/container/admin-subscriptions-page";

export const Route = createFileRoute("/(admin)/dashboard/subscriptions/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AdminSubscriptionsPage />;
}
