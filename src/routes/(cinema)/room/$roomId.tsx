import { createFileRoute, redirect } from "@tanstack/react-router";
import { CinemaRoom } from "@/components/cinema/cinema-room";

export const Route = createFileRoute("/(cinema)/room/$roomId")({
	component: CinemaRoom,
	beforeLoad: ({ context, location }) => {
		// 1. Check if authenticated
		if (!context.auth) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}

		// 2. Check for subscription (PRO or FAMILY)
		const status = context.auth.user.subscriptionStatus;
		if (status !== "PREMIUM" && status !== "FAMILY") {
			throw redirect({
				to: "/pricing",
				search: {
					redirectUrl: location.href,
				},
			});
		}
	},
});
