import { os } from "@orpc/server";
import * as Sentry from "@sentry/node";

export const sentryMiddleware = os.middleware(async ({ next, path }, input) => {
	return await Sentry.withScope(async (scope) => {
		// Attempt to set transaction name and input if available
		if (path) {
			scope.setTransactionName(
				Array.isArray(path) ? path.join("/") : String(path),
			);
		}
		if (input) {
			// @ts-expect-error - input is typed as any/unknown in middleware signature
			scope.setContext("input", { input });
		}

		try {
			// @ts-expect-error - input is passed as second argument to middleware, but next() expects context updates
			return await next({});
		} catch (error) {
			Sentry.captureException(error);
			throw error;
		}
	});
});
