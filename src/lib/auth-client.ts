// @/lib/auth-client.ts
import { createAuthClient } from "better-auth/client";
import {
	adminClient,
	apiKeyClient,
	emailOTPClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const authClient = createAuthClient({
	// In TanStack Start, the baseURL should point to your site root
	baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
	plugins: [
		emailOTPClient(),
		twoFactorClient(),
		adminClient(),
		apiKeyClient(),
		tanstackStartCookies(), // Crucial for SSR consistency
	],
});
