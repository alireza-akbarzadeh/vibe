import { Checkout } from "@polar-sh/tanstack-start";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";

export const Route = createFileRoute("/api/checkout")({
    server: {
        handlers: {
            GET: Checkout({
                accessToken: env.POLAR_ACCESS_TOKEN,
                server: env.POLAR_SERVER,
                successUrl: `${env.VITE_APP_URL}/success?checkout_id={CHECKOUT_ID}`,
                returnUrl: `${env.VITE_APP_URL}/pricing`,
                theme: "dark",

            }),
        },
    },
});
