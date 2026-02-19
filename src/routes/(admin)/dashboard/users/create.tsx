import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserForm } from "@/domains/users/components/user-form/user-form";

export const Route = createFileRoute("/(admin)/dashboard/users/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null; // Or a loading skeleton

	return <UserForm />;
}
