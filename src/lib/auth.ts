import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, apiKey, emailOTP, twoFactor } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "@/env";
import { prisma } from "@/lib/db";
import type { authClient } from "./auth-client";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: false,
	},

	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID!,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID!,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
	plugins: [
		tanstackStartCookies(),
		emailOTP({
			async sendVerificationOTP({ email, otp }) {
				console.log(`OTP for ${email}: ${otp}`);
			},
		}),
		twoFactor(),
		admin(),
		apiKey(),
	],

	user: {
		additionalFields: {
			phoneNumber: { type: "string", required: false },
			avatar: { type: "string", required: false },
			subscriptionStatus: { type: "string", defaultValue: "FREE" },
			customerId: { type: "string", required: false },
			agreeToTerms: { type: "boolean", defaultValue: false },
		},
	},

	rateLimit: {
		enabled: true,
		window: 60, // 1 minute
		max: 100, // requests per window
	},

	session: {
		expiresIn: 7 * 24 * 60 * 60, // 7 days
		updateAge: 24 * 60 * 60, // 1 day
		cookie: {
			name: "session",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		},
	},
});

export type Session = typeof authClient.$Infer.Session;
