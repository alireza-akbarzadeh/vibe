import { createFileRoute } from "@tanstack/react-router";
import { ProfileDomains } from "@/domains/profile/profile.domian";

export const Route = createFileRoute("/(home)/library/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ProfileDomains />;
}
