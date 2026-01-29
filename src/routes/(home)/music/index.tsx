import { createFileRoute } from "@tanstack/react-router";
import HomeView from "@/domains/music/container/home";

export const Route = createFileRoute("/(home)/music/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <HomeView />;
}
