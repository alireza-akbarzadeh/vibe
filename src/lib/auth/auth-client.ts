import { createAuthClient } from "better-auth/client";
import {
	adminClient,
	apiKeyClient,
	emailOTPClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
	plugins: [
		emailOTPClient(),
		twoFactorClient(),
		adminClient(),
		apiKeyClient(),
		tanstackStartCookies(),
	],
});

export const {
	signIn,
	signOut,
	signUp,
	forgetPassword,
	resetPassword,
	requestPasswordReset,
	changePassword,
} = authClient;
