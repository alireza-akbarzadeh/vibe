import "@/polyfill";

import { SmartCoercionPlugin } from "@orpc/json-schema";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createFileRoute } from "@tanstack/react-router";
import { getAuthFromRequest } from "@/lib/auth/server-auth";
import { db } from "@/lib/db.server";
import { appRouter } from "@/orpc/router";

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
	const url = new URL(request.url);
	console.log("🔍 Request URL:", url.pathname);

	try {
		const auth = await getAuthFromRequest();

		const { response } = await handler.handle(request, {
			prefix: "/api",
			context: {
				db,
				user: auth?.user,
				session: auth?.session,
			},
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
