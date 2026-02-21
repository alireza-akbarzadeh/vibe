import { os } from "@orpc/server";
import * as Sentry from "@sentry/node";

export const sentryMiddleware = os.middleware(async ({ next, path }, input) => {
	return await Sentry.withScope(async (scope) => {
		if (path) {
			scope.setTransactionName(
				Array.isArray(path) ? path.join("/") : String(path),
			);
		}
		if (input) {
			scope.setContext("input", { input });
		}

		try {
			return await next({});
		} catch (error) {
			Sentry.captureException(error);
			throw error;
		}
	});
});
