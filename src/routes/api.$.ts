import "@/polyfill";

import { auth } from "@/lib/better-auth";
import type { ORPCContext } from "@/orpc/context";
import { Http } from "@/orpc/helpers/http";
import { router } from "@/orpc/router";
import { SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const handler = new OpenAPIHandler(router, {
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
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		// Admin-only access to /api docs
		const url = new URL(request.url);
		if (url.pathname === "/api") {
			if (
				!session?.user ||
				(session.user.role !== "admin" && session.user.role !== "ADMIN")
			) {
				return new Response(
					JSON.stringify({
						defined: true,
						code: "FORBIDDEN",
						status: Http.FORBIDDEN,
						message: "Admin access required",
					}),
					{
						status: Http.FORBIDDEN,
						headers: { "Content-Type": "application/json" },
					},
				);
			}
		}

		const context: ORPCContext = {
			user: session?.user ?? undefined,
			session: session?.session ?? undefined,
		};

		const { response } = await handler.handle(request, {
			prefix: "/api",
			context,
		});

		return response ?? new Response("Not Found", { status: 404 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : String(error ?? "Unknown error");
		const stack = error instanceof Error ? error.stack : undefined;
		const isDev = import.meta.env.DEV;
		return new Response(
			JSON.stringify({
				defined: false,
				code: "INTERNAL_SERVER_ERROR",
				status: Http.INTERNAL_SERVER_ERROR,
				message: isDev ? message : "Internal server error",
				...(isDev && stack ? { stack } : {}),
			}),
			{
				status: Http.INTERNAL_SERVER_ERROR,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
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
