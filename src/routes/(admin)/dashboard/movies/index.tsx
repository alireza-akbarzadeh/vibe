import { createFileRoute } from "@tanstack/react-router";
import { MediaManagementTable } from "@/domains/dashboard/movies/containers/media-table";
import { client } from "@/orpc/client";

export const Route = createFileRoute("/(admin)/dashboard/movies/")({
	// Fast server-side data loading for admin dashboard
	loader: async ({ location }) => {
		const searchParams = new URLSearchParams(location.search);
		const page = Number.parseInt(searchParams.get("page") || "1", 10);
		const limit = Number.parseInt(searchParams.get("limit") || "50", 10);

		const response = await client.media.list({
			page,
			limit,
			status: ["DRAFT", "REVIEW", "PUBLISHED", "REJECTED"],
		});
		return { media: response.data };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { media } = Route.useLoaderData();

	return (
		<div className="container mx-auto py-6">
			<MediaManagementTable initialData={media} />
		</div>
	);
}
