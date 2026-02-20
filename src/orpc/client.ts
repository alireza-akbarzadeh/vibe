import { createORPCClient } from "@orpc/client";
import type { AppRouter } from "./router";

export const orpc = createORPCClient<AppRouter>({
	url: "/api/rpc",
});
