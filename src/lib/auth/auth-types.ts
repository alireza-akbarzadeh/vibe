import type { auth } from "./better-auth";

// Infer the session type from the auth instance
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

// Define the sign-up input type with custom fields
export interface SignUpInput {
	email: string;
	password: string;
	name: string;
	agreeToTerms: boolean;
}

// Define the sign-up email context type
export interface SignUpEmailContext {
	email: string;
	password: string;
	name: string;
	agreeToTerms: boolean;
}
