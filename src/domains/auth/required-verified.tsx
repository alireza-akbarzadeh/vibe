import { Navigate, useRouter } from "@tanstack/react-router";

export function RequireVerified({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const session = router.options.context?.auth;
	const isPending = session === undefined;

	if (isPending) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
			</div>
		);
	}

	if (!session) {
		return <Navigate to="/login" />;
	}

	if (!session.user.emailVerified) {
		return (
			<Navigate
				to="/verify"
				search={{ email: session.user.email, type: "verification" }}
			/>
		);
	}

	return children;
}
