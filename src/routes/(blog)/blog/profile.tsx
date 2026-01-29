import { createFileRoute } from "@tanstack/react-router";
import { UserProfilePage } from "@/domains/blog/components/user-profile-page";

export const Route = createFileRoute("/(blog)/blog/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return <UserProfilePage />;
}
