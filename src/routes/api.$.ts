import "@/polyfill";

import { SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { auth } from "@/lib/auth/better-auth";
import { logger } from "@/lib/logger";
import type { ORPCContext } from "@/orpc/context";
import { Http } from "@/orpc/helpers/http";
import { router } from "@/orpc/router";

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

		const url = new URL(request.url);

		// Log the incoming request for debugging
		console.log("🔍 API Request:", {
			pathname: url.pathname,
			method: request.method,
			userRole: session?.user?.role,
		});

		// Admin-only access to /api docs (root page only)
		if (url.pathname === "/api" || url.pathname === "/api/") {
			const userRole = session?.user?.role?.toUpperCase();
			if (!session?.user || userRole !== "ADMIN") {
				console.log("❌ Forbidden: User role is", userRole);
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

		console.log("✅ Calling handler.handle with:", {
			url: url.toString(),
			pathname: url.pathname,
			prefix: "/api",
			hasContext: !!context,
		});

		// Try to catch errors from the handler more explicitly
		let response: Response | undefined;
		try {
			// Create a new request to ensure clean state
			const handlerRequest = new Request(request.url, {
				method: request.method,
				headers: request.headers,
				body: request.body,
				duplex:
					request.method !== "GET" && request.method !== "HEAD"
						? "half"
						: undefined,
			} as RequestInit);

			const result = await handler.handle(handlerRequest, {
				prefix: "/api",
				context,
			});
			response = result.response;
		} catch (handlerError) {
			console.error("❌ ERROR INSIDE handler.handle():", handlerError);
			console.error("Handler error details:", {
				message:
					handlerError instanceof Error
						? handlerError.message
						: String(handlerError),
				stack: handlerError instanceof Error ? handlerError.stack : undefined,
			});
			throw handlerError; // Re-throw to be caught by outer try-catch
		}

		console.log("✅ Handler response received:", {
			hasResponse: !!response,
			status: response?.status,
		});

		// If the response is a 500 error, log the body to see what went wrong
		if (response && response.status === 500) {
			const clonedResponse = response.clone();
			const errorBody = await clonedResponse.text();
			console.error(
				"❌ OpenAPIHandler returned 500 error. Response body:",
				errorBody,
			);
			try {
				const errorJson = JSON.parse(errorBody);
				console.error("❌ Parsed error:", errorJson);
			} catch {
				console.error("❌ Could not parse error as JSON");
			}
		}

		return response ?? new Response("Not Found", { status: 404 });
	} catch (error) {
		// CRITICAL: Log the actual error to console so you can see what's failing
		console.error("❌ ORPC HANDLER ERROR:", error);
		console.error("Full error details:", {
			message: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
			name: error instanceof Error ? error.name : undefined,
		});

		const message =
			error instanceof Error ? error.message : String(error ?? "Unknown error");
		const stack = error instanceof Error ? error.stack : undefined;
		const isDev = import.meta.env.DEV;

		logger.error("Failed API route:", { error: message, stack });

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
