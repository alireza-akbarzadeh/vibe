import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/Header";
import { VideoPlayer } from "@/components/video-payler/video-player";
import { VIDEOS } from "@/constants/media";

export const Route = createFileRoute("/(demo)/demo/")({
	component: RouteComponent,
});

function RouteComponent() {
	const videoData = {
		src: VIDEOS.demo,
		videoPoster:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop",
		year: "2014",
		totalTime: "2:49:00",
		videoName: "Interstellar",
	};

	return (
		<div>
			<Header />
			<VideoPlayer {...videoData} />
			<Outlet />
		</div>
	);
}
