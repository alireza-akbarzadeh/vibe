import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import Home from "@/domains/home/home-domains";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<>
			<RootHeader />
			<Home />
		</>
	);
}
