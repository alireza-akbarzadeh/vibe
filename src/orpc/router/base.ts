import { os } from "@orpc/server";
import { z } from "zod";
import { sentryMiddleware } from "../middleware/sentry";

/**
 * Base ORPC instance with common error definitions
 * These errors are available across all procedures
 */
export const base = os.use(sentryMiddleware).errors({
	UNAUTHENTICATED: {
		message: "Authentication required",
	},
	FORBIDDEN: {
		message: "You don't have permission to perform this action",
		data: z
			.object({
				required: z.string().optional(),
			})
			.optional(),
	},
	NOT_FOUND: {
		message: "Resource not found",
	},
	CONFLICT: {
		message: "Resource already exists",
		data: z
			.object({
				field: z.string().optional(),
			})
			.optional(),
	},
	VALIDATION_ERROR: {
		message: "The provided data is invalid",
		data: z.unknown().optional(),
	},
	SUBSCRIPTION_REQUIRED: {
		message: "Subscription required",
		data: z.object({
			required: z.string(),
			upgrade: z.boolean().default(true),
		}),
	},
	RATE_LIMIT_EXCEEDED: {
		message: "Too many requests. Please try again later",
		data: z.object({
			retryAfter: z.number().int().min(1),
		}),
	},
	INTERNAL_ERROR: {
		message: "An internal server error occurred",
	},
	SERVICE_UNAVAILABLE: {
		message: "Service temporarily unavailable. Please try again later",
	},
	BAD_REQUEST: {
		message: "Bad request. Please check your input and try again.",
	},
	BAD_GATEWAY: {
		message:
			"Bad gateway. The server received an invalid response from the upstream server.",
	},
	GATEWAY_TIMEOUT: {
		message:
			"Gateway timeout. The server did not receive a timely response from the upstream server.",
	},
	TIMEOUT: {
		message: "Request timeout. The server timed out waiting for the request.",
	},
	TOO_MANY_REQUESTS: {
		message: "Too many requests. Please slow down and try again later.",
	},
	INTERNAL_SERVER_ERROR: {
		message: "Internal server error. Please try again later.",
	},
	METHOD_NOT_SUPPORTED: {
		message:
			"Method not supported. Please check the API documentation for supported methods.",
	},
	UNAUTHORIZED: {
		message: "Unauthorized. Please provide valid authentication credentials.",
	},
	UNSUPPORTED_MEDIA_TYPE: {
		message:
			"Unsupported media type. Please check the API documentation for supported media types.",
	},
	NOT_IMPLEMENTED: {
		message: "Not implemented. This feature is not available yet.",
	},
	CLIENT_CLOSED_REQUEST: {
		message:
			"Client closed request. The client closed the connection before the server could respond.",
	},
	NOT_ACCEPTABLE: {
		message:
			"Not acceptable. The requested resource is not available in a format acceptable to the client.",
	},
	PAYLOAD_TOO_LARGE: {
		message:
			"Payload too large. The request payload exceeds the server's limits.",
	},
	URI_TOO_LONG: {
		message:
			"URI too long. The requested URI is too long for the server to process.",
	},
	PRECONDITION_FAILED: {
		message:
			"Precondition failed. The server does not meet one of the preconditions specified in the request.",
	},
	PROXY_AUTHENTICATION_REQUIRED: {
		message:
			"Proxy authentication required. Please authenticate with the proxy server.",
	},
	UNPROCESSABLE_CONTENT: {
		message:
			"Unprocessable content. The server understands the content type but was unable to process the contained instructions.",
	},
	LOCKED: {
		message:
			"Locked. The resource that is being accessed is locked and cannot be modified.",
	},
	FAILED_DEPENDENCY: {
		message:
			"Failed dependency. The request failed because it depended on another request and that request failed.",
	},
	UPGRADE_REQUIRED: {
		message:
			"Upgrade required. The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.",
	},
	PRECONDITION_REQUIRED: {
		message:
			"Precondition required. The server requires the request to be conditional.",
	},
	TOO_EARLY: {
		message:
			"Too early. The server is unwilling to risk processing a request that might be replayed.",
	},
});
