import { CustomerPortal } from "@polar-sh/tanstack-start";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";
import { getSession } from "@/lib/auth-server";

export const Route = createFileRoute("/api/portal")({
    server: {
        handlers: {
            GET: CustomerPortal({
                accessToken: env.POLAR_ACCESS_TOKEN,
                server: env.POLAR_SERVER,

                // Get the authenticated user's Polar customer ID
                getCustomerId: async (_request: Request) => {
                    const session = await getSession();

                    if (!session?.user) {
                        throw new Error("Unauthorized - Please login to view portal");
                    }

                    if (!session.user.customerId) {
                        throw new Error("No active subscription found");
                    }

                    return session.user.customerId;
                },

                // Return URL (back button in portal)
                returnUrl: `${env.VITE_APP_URL}/pricing`,
            }),
        },
    },
});
