import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import AboutDomain from "@/domains/about/about.domian";

export const Route = createFileRoute("/(home)/about")({
	component: AboutPage,
});

export default function AboutPage() {
	return (
		<>
			<RootHeader />
			<AboutDomain />
		</>
	);
}
