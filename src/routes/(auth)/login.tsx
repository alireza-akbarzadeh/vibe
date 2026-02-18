import { createFileRoute } from "@tanstack/react-router";
import { LoginDomain } from "@/domains/auth/login.domain";

interface LoginSearchParams {
	redirect?: string;
}

export const Route = createFileRoute("/(auth)/login")({
	component: LoginPage,
	validateSearch: (search: Record<string, unknown>): LoginSearchParams => ({
		redirect: typeof search.redirect === 'string' ? search.redirect : undefined
	})
});

function LoginPage() {
	const { redirect } = Route.useSearch()
	return <LoginDomain redirectUrl={redirect} />;
}
