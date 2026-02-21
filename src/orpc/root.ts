import { os as createOS } from "@orpc/server";
import { z } from "zod";
import type { ORPCContext } from "./context";
import { Http } from "./helpers/http";

const errorDefinitions = {
	UNAUTHENTICATED: {
		message: "You must be authenticated to access this resource",
		data: z.object({}),
	},
	SUBSCRIPTION_REQUIRED: {
		message: "You must have a subscription to access this resource",
		data: z.object({}),
	},
	FORBIDDEN: {
		message: "You do not have permission to access this resource",
		data: z.object({}),
	},
	NOT_FOUND: {
		message: "The requested resource was not found",
		data: z.object({}),
	},
	INTERNAL_SERVER_ERROR: {
		message: "An internal server error occurred",
		data: z.object({}),
	},
	BAD_REQUEST: {
		message: "The request was invalid",
		data: z.object({}),
	},
	UNSUPPORTED_MEDIA_TYPE: {
		message: "The media type is not supported",
		data: z.object({}),
	},
	UNPROCESSABLE_ENTITY: {
		message: "The request was unprocessable",
		data: z.object({}),
	},
	TOO_MANY_REQUESTS: {
		message: "You have made too many requests",
		data: z.object({}),
	},
	METHOD_NOT_ALLOWED: {
		message: "Method not allowed",
		data: z.object({}),
	},
	CONFLICT: {
		message:
			"The request could not be completed due to a conflict with the current state of the resource.",
		data: z.object({}),
	},
	SERVICE_UNAVAILABLE: {
		message: "The server is currently unable to handle the request.",
		data: z.object({}),
	},
	GATEWAY_TIMEOUT: {
		message:
			"The server did not receive a timely response from an upstream server.",
		data: z.object({}),
	},
} as const;

export type AppErrorDefinitions = typeof errorDefinitions;

const base = createOS.$context<ORPCContext>().errors(errorDefinitions);

export const os = base;

type HandlerFunction = Parameters<typeof os.handler>[0];

export type AppErrorMap = Parameters<HandlerFunction>[0]["errors"];
