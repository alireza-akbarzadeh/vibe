import "@/polyfill";

import { SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";
import type { ORPCContext } from "@/orpc/context";
import { appRouter } from "@/orpc/router";

import { db } from "@/server/db";

const handler = new OpenAPIHandler(appRouter, {
	plugins: [
		new SmartCoercionPlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				info: {
					title: "VIBE API",
					version: "1.0.0",
				},
			},
		}),
	],
});

async function handle({ request }: { request: Request }) {
	const context: ORPCContext = {
		db,
		user: undefined,
		session: undefined,
	};

	// Log what URL is being requested
	const url = new URL(request.url);
	console.log("🔍 Request URL:", url.pathname);

	try {
		const { response } = await handler.handle(request, {
			prefix: "/api",
			context,
		});

		console.log("✅ Response status:", response?.status);

		// If 500, clone and log the body
		if (response?.status === 500) {
			const clone = response.clone();
			const text = await clone.text();
			console.error("❌ 500 Error body:", text);
		}

		return response ?? new Response("Not Found", { status: 404 });
	} catch (err) {
		console.error("❌ Unhandled error in handler:", err);
		console.error("Stack:", err instanceof Error ? err.stack : "no stack");
		throw err;
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
