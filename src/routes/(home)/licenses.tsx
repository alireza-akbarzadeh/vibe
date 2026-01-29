import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import Footer from "@/domains/home/footer";
import { LicenseDomain } from "@/domains/license/license.domain";

export const Route = createFileRoute("/(home)/licenses")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<RootHeader />
			<LicenseDomain />
			<Footer />
		</>
	);
}
