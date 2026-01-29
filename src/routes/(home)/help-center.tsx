import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import { HelpCenter } from "@/domains/help-center/help-center.domain";
import Footer from "@/domains/home/footer";

export const Route = createFileRoute("/(home)/help-center")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<RootHeader />
			<HelpCenter />
			<Footer />
		</>
	);
}
