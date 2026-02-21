import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, apiKey, emailOTP, twoFactor } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "@/env";
import { polarClient } from "@/integrations/polar/polar-client";
import { sendEmail } from "@/integrations/resend/email";
import {
	accountDeletedEmail,
	otpCodeEmail,
	passwordResetEmail,
	welcomeVerifyEmail,
} from "@/integrations/resend/email-templates";
import { prisma } from "@/lib/db.server";
import type { authClient } from "./auth-client";

const emailFrom = "Vibe <noreply@vibeapp.com>";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: ["http://localhost:3000", "https://vibeapp.com"],
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,

	// ─── Email & Password ───────────────────────────────────────
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				from: emailFrom,
				to: user.email,
				subject: "Reset your Vibe password",
				html: passwordResetEmail(url),
			});
		},
	},

	// ─── Email Verification ─────────────────────────────────────
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmail({
				from: emailFrom,
				to: user.email,
				subject: "Welcome to Vibe — Verify your email",
				html: welcomeVerifyEmail(user.name, url),
			});
		},
	},

	// ─── Social Auth ────────────────────────────────────────────
	appName: env.VITE_APP_TITLE,
	socialProviders: {
		google: {
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			clientId: env.GOOGLE_CLIENT_ID,
		},
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google"],
		},
	},

	// ─── Plugins ────────────────────────────────────────────────
	plugins: [
		tanstackStartCookies(),
		emailOTP({
			async sendVerificationOTP({ email, otp }) {
				await sendEmail({
					from: emailFrom,
					to: email,
					subject: `${otp} is your Vibe verification code`,
					html: otpCodeEmail(otp),
				});
			},
		}),
		twoFactor(),
		admin(),
		apiKey(),
	],

	// ─── User Config ────────────────────────────────────────────
	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, newEmail, url }) => {
				await sendEmail({
					from: emailFrom,
					to: newEmail,
					subject: "Confirm your new email — Vibe",
					html: welcomeVerifyEmail(user.name, url),
				});
			},
		},
		deleteUser: {
			enabled: true,
			afterDelete: async (user) => {
				await polarClient.customers.deleteExternal({
					externalId: user.id,
				});
				await sendEmail({
					from: emailFrom,
					to: user.email,
					subject: "Your Vibe account has been deleted",
					html: accountDeletedEmail(user.name),
				});
			},
		},
		additionalFields: {
			subscriptionStatus: { type: "string", defaultValue: "FREE" },
			customerId: { type: "string", required: false },
			currentPlan: { type: "string", required: false },
			banned: { type: "boolean", required: false },
			updatedAt: { type: "date", required: false },
			agreeToTerms: {
				type: "boolean",
				required: true,
				defaultValue: false,
				input: true,
			},
			phoneNumber: {
				type: "string",
				required: false,
				input: true,
			},
		},
	},

	// ─── Rate Limiting ──────────────────────────────────────────
	rateLimit: {
		enabled: true,
		window: 60,
		max: 100,
		customRules: {
			"/sign-in/email": { window: 60, max: 5 },
			"/sign-up/email": { window: 60, max: 3 },
			"/forget-password": { window: 300, max: 3 },
			"/reset-password": { window: 300, max: 5 },
			"/send-verification-email": { window: 60, max: 3 },
			"/email-otp/send-verification-otp": { window: 60, max: 3 },
		},
	},

	// ─── Session ────────────────────────────────────────────────
	session: {
		expiresIn: 7 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
		cookie: {
			name: "session",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		},
	},
});

export type AuthSessionType = typeof auth.$Infer.Session;
