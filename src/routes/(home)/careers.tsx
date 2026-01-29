import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import { CareersDomain } from "@/domains/careers/careers.domain";
import Footer from "@/domains/home/footer";

export const Route = createFileRoute("/(home)/careers")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<RootHeader />
			<CareersDomain />
			<Footer />
		</>
	);
}
