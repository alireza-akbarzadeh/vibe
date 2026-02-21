// server-client.ts
import { createRouterClient } from "@orpc/server";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { getAuthFromRequest } from "@/lib/auth/server-auth";
import { db } from "@/lib/db.server";
import type { ORPCContext } from "@/orpc/context";
import { appRouter } from "@/orpc/router";

export async function getServerClient() {
	// Get auth outside the context function
	const auth = await getAuthFromRequest();
	const headers = getRequestHeaders();

	const baseContext: ORPCContext = {
		db,
		headers,
		...(auth?.user && { user: auth.user }),
		...(auth?.session && { session: auth.session }),
	};

	return createRouterClient(appRouter, {
		context: () => Promise.resolve(baseContext),
	});
}
