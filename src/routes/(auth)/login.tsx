import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginDomain } from "@/domains/auth/login.domain";

export const Route = createFileRoute("/(auth)/login")({
	beforeLoad: ({ context }) => {
		if (context.auth?.session) {
			throw redirect({ to: "/" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	return (
		<LoginDomain />
	)
}
