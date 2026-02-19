import { createFileRoute } from "@tanstack/react-router";
import { AdminProductsPage } from "@/domains/dashboard/container/admin-products-page";

export const Route = createFileRoute("/(admin)/dashboard/products/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AdminProductsPage />;
}
