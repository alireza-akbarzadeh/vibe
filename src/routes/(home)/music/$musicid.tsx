import { createFileRoute } from "@tanstack/react-router";
import { ArtistProfile } from "@/domains/music/container/artists/artist.domains";

export const Route = createFileRoute("/(home)/music/$musicid")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ArtistProfile />;
}
