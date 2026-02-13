// app/routes/api/$.ts
import "@/polyfill";

import { SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { auth } from "@/lib/better-auth";
import type { ORPCContext } from "@/orpc/context";
import { router } from "@/orpc/router";

const handler = new OpenAPIHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
	plugins: [
		new SmartCoercionPlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				info: {
					title: "TanStack ORPC Playground",
					version: "1.0.0",
				},
				commonSchemas: {
					ErrorResponse: {
						schema: z.object({
							code: z.string(),
							message: z.string(),
							status: z.number(),
						}),
					},
					ValidationError: {
						schema: z.object({
							code: z.string(),
							message: z.string(),
							errors: z.array(
								z.object({
									path: z.array(z.string()),
									message: z.string(),
								}),
							),
						}),
					},
				},
				security: [{ bearerAuth: [] }],
				components: {
					securitySchemes: {
						bearerAuth: {
							type: "http",
							scheme: "bearer",
						},
					},
				},
			},
			docsConfig: {
				authentication: {
					securitySchemes: {
						bearerAuth: {
							token: "",
						},
					},
				},
			},
		}),
	],
});

async function handle({ request }: { request: Request }) {
	const url = new URL(request.url);

	if (url.pathname === "/api") {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		const isAdmin = session?.user?.role === "admin";

		if (!session || !isAdmin) {
			throw redirect({
				to: "/unauthorized",
				search: {
					error: "Admin access required",
					from: url.pathname,
					requiredRole: "admin",
				},
			});
		}
	}

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	const context: ORPCContext = {
		user: session?.user ?? undefined,
		session: session?.session ?? undefined,
	};

	const { response } = await handler.handle(request, {
		prefix: "/api",
		context,
	});

	return response ?? new Response("Not Found", { status: 404 });
}

export const Route = createFileRoute("/api/$")({
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
