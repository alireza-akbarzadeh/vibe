import { createFileRoute } from "@tanstack/react-router";
import { getSession } from "@/lib/auth/auth-server";
import { prisma } from "@/lib/db";

export const Route = createFileRoute("/api/subscription/status")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const session = await getSession();

					if (!session?.user) {
						return new Response(
							JSON.stringify({
								status: "NONE",
								currentPlan: null,
								customerId: null,
							}),
							{
								status: 200,
								headers: { "Content-Type": "application/json" },
							},
						);
					}
					const user = await prisma.user.findUnique({
						where: { id: session.user.id },
						select: {
							subscriptionStatus: true,
							currentPlan: true,
							customerId: true,
						},
					});

					return new Response(
						JSON.stringify({
							status: user?.subscriptionStatus || "FREE",
							currentPlan: user?.currentPlan || null,
							customerId: user?.customerId || null,
						}),
						{
							status: 200,
							headers: { "Content-Type": "application/json" },
						},
					);
				} catch (_error) {
					return new Response(
						JSON.stringify({ error: "Failed to fetch subscription status" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
