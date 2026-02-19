/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

import { toast } from "sonner";
import { Http } from "@/orpc/helpers/http";
export type ErrorCode =
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "NOT_FOUND"
	| "VALIDATION_ERROR"
	| "INTERNAL_ERROR"
	| "CHECKOUT_FAILED"
	| "PAYMENT_FAILED"
	| "NETWORK_ERROR"
	| "RATE_LIMITED";

export interface AppErrorDetails {
	code: ErrorCode;
	message: string;
	status?: number;
	data?: any;
	originalError?: unknown;
}

export class AppError extends Error {
	public readonly code: ErrorCode;
	public readonly status: number;
	public readonly data?: any;
	public readonly originalError?: unknown;

	constructor(details: AppErrorDetails) {
		super(details.message);
		this.name = "AppError";
		this.code = details.code;
		this.status = details.status || 500;
		this.data = details.data;
		this.originalError = details.originalError;

		// Maintains proper stack trace for where error was thrown
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError);
		}
	}

	// Helper to check if error is unauthorized
	isUnauthorized(): boolean {
		return this.code === "UNAUTHORIZED";
	}

	// Helper to get user-friendly message
	getUserFriendlyMessage(): string {
		switch (this.code) {
			case "UNAUTHORIZED":
				return "You need an account to proceed. Please sign up or log in.";
			case "FORBIDDEN":
				return "You don't have permission to perform this action.";
			case "NOT_FOUND":
				return "The requested resource was not found.";
			case "VALIDATION_ERROR":
				return "Please check your input and try again.";
			case "CHECKOUT_FAILED":
				return "Checkout process failed. Please try again.";
			case "PAYMENT_FAILED":
				return "Payment processing failed. Please try another method.";
			case "NETWORK_ERROR":
				return "Network error. Please check your connection.";
			case "RATE_LIMITED":
				return "Too many requests. Please try again later.";
			default:
				return "Something went wrong. Please try again.";
		}
	}

	// Convert to JSON for API responses
	toJSON() {
		return {
			error: this.code,
			message: this.message,
			status: this.status,
			data: this.data,
		};
	}
}

export const Errors = {
	unauthorized: (message?: string, originalError?: unknown): AppError => {
		const msg =
			message || "You need an account to proceed. Please sign up or log in.";

		return new AppError({
			code: "UNAUTHORIZED",
			message: msg,
			status: Http.UNAUTHORIZED,
			originalError,
		});
	},

	forbidden: (message?: string, originalError?: unknown): AppError => {
		const _msg = message || "Access denied.";
		return new AppError({
			code: "FORBIDDEN",
			message: message || "Access denied.",
			status: Http.FORBIDDEN,
			originalError,
		});
	},

	notFound: (resource?: string, originalError?: unknown): AppError => {
		const msg = resource ? `${resource} not found.` : "Resource not found.";

		return new AppError({
			code: "NOT_FOUND",
			message: msg,
			status: Http.NOT_FOUND,
			originalError,
		});
	},

	bad_Request: (
		message: string,
		data?: any,
		originalError?: unknown,
	): AppError => {
		return new AppError({
			code: "VALIDATION_ERROR",
			message,
			status: Http.BAD_REQUEST,
			data,
			originalError,
		});
	},

	checkoutFailed: (message?: string, originalError?: unknown): AppError => {
		const _msg = message || "Checkout creation failed.";
		return new AppError({
			code: "CHECKOUT_FAILED",
			message: message || "Checkout creation failed.",
			status: Http.INTERNAL_SERVER_ERROR,
			originalError,
		});
	},

	paymentFailed: (message?: string, originalError?: unknown): AppError => {
		const msg = message || "Payment processing failed.";

		return new AppError({
			code: "PAYMENT_FAILED",
			message: msg,
			status: Http.PAYMENT_REQUIRED,
			originalError,
		});
	},
	networkError: (originalError?: unknown): AppError => {
		const msg = "Network connection error.";
		return new AppError({
			code: "NETWORK_ERROR",
			message: msg,
			status: Http.SERVICE_UNAVAILABLE,
			originalError,
		});
	},

	rateLimited: (message?: string, originalError?: unknown): AppError => {
		const msg = message || "Too many requests. Please try again later.";

		return new AppError({
			code: "RATE_LIMITED",
			message: msg,
			status: Http.TOO_MANY_REQUESTS,
			originalError,
		});
	},

	internal: (message?: string, originalError?: unknown): AppError => {
		const msg = message || "An internal error occurred.";

		return new AppError({
			code: "INTERNAL_ERROR",
			message: msg,
			status: Http.INTERNAL_SERVER_ERROR,
			originalError,
		});
	},
};

export function useErrorHandler() {
	const handleError = (
		error: unknown,
		options?: {
			showToast?: boolean;
			redirectOnUnauthorized?: boolean;
			callbackUrl?: string;
		},
	) => {
		console.error("[Error Handler]:", error);

		// If it's already AppError, use it directly
		if (error instanceof AppError) {
			if (error.isUnauthorized() && options?.redirectOnUnauthorized !== false) {
				if (options?.showToast !== false) {
					toast.error("Authentication Required", {
						description: error.getUserFriendlyMessage(),
					});
				}

				const callbackUrl = options?.callbackUrl || window.location.pathname;
				const loginUrl = `/login?redirectUrl=${encodeURIComponent(callbackUrl)}`;

				setTimeout(() => {
					window.location.href = loginUrl;
				}, 500);

				return;
			}

			if (options?.showToast !== false) {
				toast.error(error.code.replace("_", " "), {
					description: error.getUserFriendlyMessage(),
				});
			}

			return error;
		}

		// Parse TanStack serialized error format
		let errorMessage = "";
		if (error && typeof error === "object") {
			const err = error as any;

			// Complex nested format: {p: {k: [...], v: [...]}}
			if (err.p && Array.isArray(err.p.v)) {
				for (const item of err.p.v) {
					if (item.s && typeof item.s === "object" && item.s.message) {
						if (item.s.message.s) {
							errorMessage = item.s.message.s;
							break;
						}
					}
				}
			}

			// Simpler nested format: {s: {message: {s: "text"}}}
			if (!errorMessage && err.s && err.s.message && err.s.message.s) {
				errorMessage = err.s.message.s;
			}

			// Simple format: {message: {s: "text"}}
			if (!errorMessage && err.message && err.message.s) {
				errorMessage = err.message.s;
			}
		}

		// Check if it's an unauthorized error
		const isUnauthorized =
			errorMessage &&
			(errorMessage.toLowerCase().includes("unauthorized") ||
				errorMessage.toLowerCase().includes("sign up") ||
				errorMessage.toLowerCase().includes("log in"));

		if (isUnauthorized && options?.redirectOnUnauthorized !== false) {
			if (options?.showToast !== false) {
				toast.error("Authentication Required", {
					description: errorMessage || "Please sign in to continue",
				});
			}

			const callbackUrl = options?.callbackUrl || window.location.pathname;
			const loginUrl = `/login?redirectUrl=${encodeURIComponent(callbackUrl)}`;

			setTimeout(() => {
				window.location.href = loginUrl;
			}, 500);

			return;
		}

		// For other errors, show generic message
		if (options?.showToast !== false) {
			const message =
				errorMessage ||
				(error instanceof Error
					? error.message
					: "An unexpected error occurred");
			toast.error("Error", { description: message });
		}
	};

	return { handleError };
}
