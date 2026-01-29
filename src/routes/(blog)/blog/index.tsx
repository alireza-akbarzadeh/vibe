import { createFileRoute } from "@tanstack/react-router";
import { BlogLayout } from "@/domains/blog/blog-layout";
import Blog from "@/domains/blog/container/blog.domain";

export const Route = createFileRoute("/(blog)/blog/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<BlogLayout>
			<Blog />
		</BlogLayout>
	);
}
