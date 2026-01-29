import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import Footer from "@/domains/home/footer";
import { Plans } from "@/domains/plans/plans.domains";

export const Route = createFileRoute("/(home)/pricing")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<RootHeader />
			<Plans />
			<Footer />
		</>
	);
}
