import { os as createOS } from "@orpc/server";
import type { ORPCContext } from "./context";

export const oprcError = {
	// ---------------- AUTH ----------------
	UNAUTHENTICATED: {
		status: 401,
		message: "Authentication required",
	},
	UNAUTHORIZED: {
		status: 401,
		message: "Unauthorized",
	},
	FORBIDDEN: {
		status: 403,
		message: "Forbidden",
	},
	SUBSCRIPTION_REQUIRED: {
		status: 403,
		message: "Active subscription required",
	},
	EMAIL_NOT_VERIFIED: {
		status: 403,
		message: "Email verification required",
	},

	// ---------------- VALIDATION ----------------
	BAD_REQUEST: {
		status: 400,
		message: "Bad Request",
	},
	VALIDATION_ERROR: {
		status: 422,
		message: "Validation failed",
	},
	INVALID_INPUT: {
		status: 422,
		message: "Invalid input data",
	},
	INVALID_QUERY: {
		status: 400,
		message: "Invalid query parameters",
	},

	// ---------------- RESOURCE ----------------
	NOT_FOUND: {
		status: 404,
		message: "Resource not found",
	},
	ALREADY_EXISTS: {
		status: 409,
		message: "Resource already exists",
	},
	CONFLICT: {
		status: 409,
		message: "Conflict",
	},
	DUPLICATE_ENTRY: {
		status: 409,
		message: "Duplicate entry",
	},

	// ---------------- BUSINESS LOGIC ----------------
	OPERATION_NOT_ALLOWED: {
		status: 403,
		message: "Operation not allowed",
	},
	INSUFFICIENT_PERMISSIONS: {
		status: 403,
		message: "Insufficient permissions",
	},
	INVALID_STATE: {
		status: 409,
		message: "Invalid resource state",
	},

	// ---------------- RATE LIMIT / ABUSE ----------------
	TOO_MANY_REQUESTS: {
		status: 429,
		message: "Too many requests",
	},
	RATE_LIMIT_EXCEEDED: {
		status: 429,
		message: "Rate limit exceeded",
	},

	// ---------------- SERVER ----------------
	INTERNAL_SERVER_ERROR: {
		status: 500,
		message: "Internal server error",
	},
	SERVICE_UNAVAILABLE: {
		status: 503,
		message: "Service unavailable",
	},
	DATABASE_ERROR: {
		status: 500,
		message: "Database operation failed",
	},

	// ---------------- EXTERNAL SERVICES ----------------
	EXTERNAL_API_ERROR: {
		status: 502,
		message: "External service error",
	},
	TMDB_ERROR: {
		status: 502,
		message: "TMDB API error",
	},
};

export type AppErrorMap = typeof oprcError;

export const os = createOS
	.$context<ORPCContext>()
	.errors<AppErrorMap>(oprcError);
