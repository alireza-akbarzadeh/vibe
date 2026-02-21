import { os as createOS } from "@orpc/server";
import type { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import type { DatabaseClient } from "@/lib/db.server";
import type { AuthContext } from "./middleware/middleware";

// Definition moved from context/index.ts
export type ORPCContext = {
	db: DatabaseClient;
	headers: ReturnType<typeof getRequestHeaders>;
} & Partial<AuthContext>;

const errorDefinitions = {
	UNAUTHENTICATED: {
		message: "You must be authenticated to access this resource",
		data: z.object({}).optional(),
	},
	SUBSCRIPTION_REQUIRED: {
		message: "You must have a subscription to access this resource",
		data: z.object({}).optional(),
	},
	FORBIDDEN: {
		message: "You do not have permission to access this resource",
		data: z.object({}).optional(),
	},
	NOT_FOUND: {
		message: "The requested resource was not found",
		data: z.object({}).optional(),
	},
	INTERNAL_SERVER_ERROR: {
		message: "An internal server error occurred",
		data: z.object({}).optional(),
	},
	BAD_REQUEST: {
		message: "The request was invalid",
		data: z.object({}).optional(),
	},
	UNSUPPORTED_MEDIA_TYPE: {
		message: "The media type is not supported",
		data: z.object({}).optional(),
	},
	UNPROCESSABLE_ENTITY: {
		message: "The request was unprocessable",
		data: z.object({}).optional(),
	},
	TOO_MANY_REQUESTS: {
		message: "You have made too many requests",
		data: z.object({}).optional(),
	},
	METHOD_NOT_ALLOWED: {
		message: "Method not allowed",
		data: z.object({}).optional(),
	},
	CONFLICT: {
		message:
			"The request could not be completed due to a conflict with the current state of the resource.",
		data: z.object({}).optional(),
	},
	SERVICE_UNAVAILABLE: {
		message: "The server is currently unable to handle the request.",
		data: z.object({}).optional(),
	},
	GATEWAY_TIMEOUT: {
		message:
			"The server did not receive a timely response from an upstream server.",
		data: z.object({}).optional(),
	},
} as const;

export type AppErrorDefinitions = typeof errorDefinitions;

const base = createOS.$context<ORPCContext>().errors(errorDefinitions);

export const os = base;

type HandlerFunction = Parameters<typeof os.handler>[0];

export type AppErrorMap = Parameters<HandlerFunction>[0]["errors"];
