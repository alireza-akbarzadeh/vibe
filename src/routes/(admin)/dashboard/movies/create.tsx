import { createFileRoute } from "@tanstack/react-router";
import { MediaForm } from "@/domains/dashboard/movies/components/media-form/media-form";

export const Route = createFileRoute("/(admin)/dashboard/movies/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto py-6">
			<MediaForm mode="create" />
		</div>
	);
}
