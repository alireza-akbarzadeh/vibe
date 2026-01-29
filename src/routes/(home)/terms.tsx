import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import Footer from "@/domains/home/footer";
import { TermsAndConditionsDomain } from "@/domains/terms/terms.domain";

export const Route = createFileRoute("/(home)/terms")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<RootHeader />
			<TermsAndConditionsDomain />
			<Footer />
		</>
	);
}
