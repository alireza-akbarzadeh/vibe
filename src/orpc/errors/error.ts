import { ORPCError, os } from "@orpc/server";
import { z } from "zod";

/**
 * Base ORPC instance with common error definitions
 * These errors are available across all procedures
 */
export const base = os.errors({
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
});

// Export the ORPCError class for direct use when needed
export { ORPCError };

/**
 * Helper function to throw ORPC errors for Prisma database errors
 */
export function throwPrismaError(error: unknown): never {
	// Unique constraint violation
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		error.code === "P2002"
	) {
		const field =
			(error as { meta?: { target?: string[] } }).meta?.target?.[0] || "field";
		throw new ORPCError("CONFLICT", {
			message: `A record with this ${field} already exists.`,
			data: { field },
		});
	}

	// Record not found
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		error.code === "P2025"
	) {
		throw new ORPCError("NOT_FOUND");
	}

	// Foreign key constraint violation
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		error.code === "P2003"
	) {
		throw new ORPCError("VALIDATION_ERROR", {
			message: "Invalid reference. The related record does not exist.",
		});
	}

	// Connection error
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		error.code === "P2024"
	) {
		throw new ORPCError("SERVICE_UNAVAILABLE");
	}

	// Unknown database error
	throw new ORPCError("INTERNAL_ERROR", {
		message:
			process.env.NODE_ENV === "development"
				? error instanceof Error
					? error.message
					: "Database error"
				: "An unexpected error occurred.",
	});
}
