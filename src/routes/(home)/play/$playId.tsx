import { createFileRoute, redirect } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VideoPlayer } from "@/components/video-payler/video-player";
import { VIDEOS } from "@/constants/media";




export const Route = createFileRoute("/(home)/play/$playId")({
	component: RouteComponent,
	beforeLoad: ({ context, location }) => {
		// 1. Check if authenticated
		if (!context.auth) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}

		// 2. Check for subscription (PRO or FAMILY)
		const status = context.auth.user.subscriptionStatus;
		if (status !== "PREMIUM" && status !== "FAMILY") {
			throw redirect({
				to: "/pricing",
				search: {
					redirectUrl: location.href,
				},
			});
		}
	},
});

function RouteComponent() {
	const playId = "s";
	const videoData = {
		src: VIDEOS.demo,
		videoPoster:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop",
		year: "2014",
		totalTime: "2:49:00",
		videoName: "Interstellar",
	};

	return (
		<div className="relative">
			{/* Watch Together Tech/Help Popover */}
			<div className="absolute top-4 left-4 z-50">
				<Popover>
					<PopoverTrigger asChild>
						<Button size="icon" variant="ghost" aria-label="Watch Together Info">
							<Info className="w-5 h-5" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80">
						<div className="font-bold text-base mb-1 flex items-center gap-2">
							<Info className="w-4 h-4 text-purple-500" />
							Watch Together Tips
						</div>
						<ul className="text-sm text-zinc-300 list-disc pl-5 space-y-1">
							<li>Share the session link to invite friends to watch together in real time.</li>
							<li>Playback is synced for all viewers in the session.</li>
							<li>Use the chat button to open the sidebar and talk live.</li>
							<li>Avatars show who is currently watching with you.</li>
							<li>For best experience, use a modern browser and stable internet.</li>
						</ul>
						<div className="mt-3 text-xs text-zinc-400">Having issues? Refresh the page or check your connection.</div>
					</PopoverContent>
				</Popover>
			</div>
			<VideoPlayer videoId={playId} {...videoData} />
		</div>
	);
}
