import { createFileRoute } from "@tanstack/react-router";
import { RegisterDomain } from "@/domains/auth/register.domain";

interface RegisterSearch {
	redirectUrl?: string;
}

export const Route = createFileRoute("/(auth)/register")({
	validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
		redirectUrl:
			typeof search.redirectUrl === "string" ? search.redirectUrl : undefined,
	}),
	component: Register,
});

function Register() {
	const { redirectUrl } = Route.useSearch();
	return <RegisterDomain redirectUrl={redirectUrl} />;
}
