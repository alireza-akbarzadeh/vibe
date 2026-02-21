import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient, type RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { type AppRouter, appRouter } from "@/orpc/router";

export const orpc = createIsomorphicFn()
	.server(() =>
		createTanstackQueryUtils(
			createRouterClient<AppRouter>(appRouter, {
				context: async () => ({
					headers: getRequestHeaders(),
				}),
			}),
		),
	)
	.client(() => {
		const link = new RPCLink({
			url: `${window.location.origin}/api/rpc`,
		});

		return createTanstackQueryUtils(createORPCClient<AppRouter>(link));
	})();
