import { createFileRoute } from "@tanstack/react-router";
import { UserForm } from "@/domains/users/components/user-form/user-form";
import { getUsers } from "@/domains/users/server/users.functions";

export const Route = createFileRoute("/(admin)/dashboard/users/edit")({
	component: RouteComponent,
	loader: async () => {
		const users = await getUsers();
		return { users };
	},
});

function RouteComponent() {
	const { users } = Route.useLoaderData();
	const { userId } = Route.useSearch() as { userId: string };
	const initialData = users.find((u) => u.id === userId);

	if (!initialData) {
		return (
			<div className="p-10 text-white font-mono">ERR: IDENTITY_NOT_FOUND</div>
		);
	}

	return <UserForm mode="edit" initialData={initialData} />;
}
