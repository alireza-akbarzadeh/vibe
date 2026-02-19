import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouter } from "./router";

export const client = createORPCClient<AppRouter>({
	links: [
		new RPCLink({
			url: `${process.env.VITE_SERVER_URL}/api/rpc`,
		}),
	],
});

export const orpc = createTanstackQueryUtils({
	client,
});
