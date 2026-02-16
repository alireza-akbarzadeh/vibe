import "@/polyfill";

import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/better-auth";
import { rpcLogger } from "@/lib/rpc-logger";
import type { ORPCContext } from "@/orpc/context";
import { router } from "@/orpc/router";

const handler = new RPCHandler(router, {
	plugins: [
		new LoggingHandlerPlugin({
			logger: rpcLogger,
			generateId: () => crypto.randomUUID(),
			logRequestResponse: true,
			logRequestAbort: true,
		}),
	],
});

async function handle({ request }: { request: Request }) {
	try {
		const url = new URL(request.url);
		if (
			request.method === "GET" &&
			(url.pathname === "/api/rpc" || url.pathname === "/api/rpc/")
		) {
			return new Response(
				JSON.stringify({
					message:
						"oRPC endpoint. Use POST for procedure calls. OpenAPI dashboard: /api",
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } },
			);
		}

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
	} catch (error) {
		const message =
			error instanceof Error ? error.message : String(error ?? "Unknown error");
		const stack = error instanceof Error ? error.stack : undefined;
		rpcLogger.error(
			{
				url: request.url,
				method: request.method,
				error: message,
				...(stack && { stack }),
			},
			"RPC request failed",
		);
		const isDev = process.env.NODE_ENV !== "production";
		return new Response(
			JSON.stringify({
				defined: false,
				code: "INTERNAL_SERVER_ERROR",
				status: 500,
				message: isDev ? message : "Internal server error",
				...(isDev && stack && { stack }),
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
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
