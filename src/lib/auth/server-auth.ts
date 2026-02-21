import type { ExtendedUser } from "@/lib/auth/better-auth";
import { auth } from "@/lib/auth/better-auth";

/**
 * Retrieves the authenticated user and session from the incoming request.
 * This is a server-side utility that leverages `better-auth`'s cookie-based session management.
 * @returns The user and session if authenticated, otherwise null.
 */
export async function getAuthFromRequest() {
	try {
		const sessionData = await auth.api.getSession();
		if (!sessionData) {
			return null;
		}
		const { user, session } = sessionData;
		// Cast the user to include your custom fields
		const typedUser = user as ExtendedUser;
		return { user: typedUser, session };
	} catch (error) {
		console.error("Failed to get auth from request:", error);
		return null;
	}
}
