import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/Header";
import { VideoPlayer } from "@/components/video-payler/video-player";

export const Route = createFileRoute("/demo/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Header />
			<VideoPlayer src="" />
			<Outlet />
		</div>
	);
}
