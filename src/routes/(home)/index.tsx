import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import Footer from "@/domains/home/footer";
import Home from "@/domains/home/home-domains";

export const Route = createFileRoute("/(home)/")({
	component: App,
});

function App() {
	return (
		<>
			<RootHeader />
			<Home />
			<Footer />
		</>
	)
}
