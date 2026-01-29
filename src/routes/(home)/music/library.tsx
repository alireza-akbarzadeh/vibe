import { createFileRoute } from "@tanstack/react-router";
import { LibraryView } from "@/domains/music/components/library-view";

export const Route = createFileRoute("/(home)/music/library")({
	component: LibraryRouteComponent,
});

function LibraryRouteComponent() {
	return <LibraryView />;
}
