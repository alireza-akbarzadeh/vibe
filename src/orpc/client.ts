import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { db } from "@/lib/db.server";
import { type AppRouter, appRouter } from "@/orpc/router";
import { getAuthFromRequest } from "../lib/auth/server-auth";

const getORPCClient = createIsomorphicFn()
	.server(() =>
		createRouterClient(appRouter, {
			context: async () => {
				const auth = await getAuthFromRequest();
				return {
					headers: getRequestHeaders(),
					user: auth?.user,
					session: auth?.session,
					db,
				};
			},
		}),
	)
	.client(() => {
		const link = new RPCLink({
			url: `${window.location.origin}/api/rpc`,
		});
		return createORPCClient<AppRouter>(link);
	});

export const client: RouterClient<typeof appRouter> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
