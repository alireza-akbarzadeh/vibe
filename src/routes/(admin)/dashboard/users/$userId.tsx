import { createFileRoute } from "@tanstack/react-router";
import { UserForm } from "@/domains/users/components/user-form/user-form";

export const Route = createFileRoute("/(admin)/dashboard/users/$userId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <UserForm />;
}
