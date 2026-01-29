import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import { DownloadPage } from "@/domains/download/download.domain";

export const Route = createFileRoute("/(home)/download")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<RootHeader />
			<DownloadPage />
		</div>
	);
}
