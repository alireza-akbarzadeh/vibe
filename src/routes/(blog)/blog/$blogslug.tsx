import { createFileRoute } from "@tanstack/react-router";
import { BlogPost } from "@/domains/blog/container/blog-details";

export const Route = createFileRoute("/(blog)/blog/$blogslug")({
	component: RouteComponent,
});

function RouteComponent() {
	return <BlogPost />;
}
