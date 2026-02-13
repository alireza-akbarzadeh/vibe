// app/routes/api/rpc/$.ts
import "@/polyfill";

import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/better-auth";
import type { ORPCContext } from "@/orpc/context";
import { router } from "@/orpc/router";

const handler = new RPCHandler(router);

async function handle({ request }: { request: Request }) {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	const context: ORPCContext = {
		user: session?.user ?? undefined,
		session: session?.session ?? undefined,
	};

	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context,
	});

	return response ?? new Response("Not Found", { status: 404 });
}

export const Route = createFileRoute("/api/rpc/$")({
	server: {
		handlers: {
			HEAD: handle,
			GET: handle,
			POST: handle,
			PUT: handle,
			PATCH: handle,
			DELETE: handle,
		},
	},
});
