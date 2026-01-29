import { createFileRoute } from "@tanstack/react-router";
import { RootHeader } from "@/components/root-header";
import { ContactDomain } from "@/domains/contact/contact.domain";
import Footer from "@/domains/home/footer";

export const Route = createFileRoute("/(home)/contact")({
	component: ContactPage,
});

function ContactPage() {
	return (
		<>
			<RootHeader />
			<ContactDomain />
			<Footer />
		</>
	);
}
