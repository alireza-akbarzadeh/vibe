import { createFileRoute } from "@tanstack/react-router";
import { LikedLibraryDomain } from "@/domains/library/containers/liked.domain";

export const Route = createFileRoute("/(library)/library/liked")({
	component: RouteComponent,
});

function RouteComponent() {
	return <LikedLibraryDomain />;
}
