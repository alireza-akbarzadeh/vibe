import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import Footer from "@/domains/home/footer";
import { PrivacyDomain } from "@/domains/privacy/privacy.domain";

export const Route = createFileRoute("/(home)/privacy")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<RootHeader />
			<PrivacyDomain />
			<Footer />
		</>
	);
}
