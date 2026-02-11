import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterDomain } from "@/domains/auth/register.domain";


export const Route = createFileRoute("/(auth)/register")({
	beforeLoad: ({ context }) => {
		if (context.auth?.session) {
			throw redirect({ to: "/" });
		}
	},
	component: Register,
});

function Register() {
	return (
		<RegisterDomain />
	);
}
