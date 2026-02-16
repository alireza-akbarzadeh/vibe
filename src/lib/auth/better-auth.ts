import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, apiKey, emailOTP, twoFactor } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "@/env";
import { polarClient } from "@/integrations/polar/polar-client";
import { getEmailTemplate, sendEmail } from "@/integrations/resend/email";
import { prisma } from "@/lib/db";
import type { authClient } from "./auth-client";

const emailFrom = "Acme <onboarding@resend.dev>";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: ["http://localhost:3000", "https://vibeapp.com"],
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				from: emailFrom,
				to: user.email,
				subject: "Reset your password",
				html: getEmailTemplate({
					title: "Reset Password",
					message:
						"We received a request to reset your password. Click the button below to proceed.",
					buttonText: "Reset Password",
					buttonUrl: url,
				}),
			});
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmail({
				from: emailFrom,
				to: user.email,
				subject: "Email Verification",
				html: getEmailTemplate({
					title: "Welcome to Vibe!",
					message:
						"Thanks for signing up. Please verify your email address to get started.",
					buttonText: "Verify Email",
					buttonUrl: url,
				}),
			});
		},
	},
	appName: env.VITE_APP_TITLE,
	socialProviders: {
		google: {
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			clientId: env.GOOGLE_CLIENT_ID,
		},
	},
	plugins: [
		tanstackStartCookies(),
		emailOTP({
			async sendVerificationOTP({ email, otp }) {
				await sendEmail({
					from: emailFrom,
					to: email,
					subject: "Your Verification Code",
					html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                <h2>Verify your email</h2>
                <p>Use the code below to complete your sign-up:</p>
                <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">
                    ${otp}
                </h1>
                <p>This code will expire in 10 minutes.</p>
            </div>
        `,
				});
			},
		}),
		twoFactor(),
		admin(),
		apiKey(),
	],
	user: {
		deleteUser: {
			enabled: true,
			afterDelete: async (user) => {
				await polarClient.customers.deleteExternal({
					externalId: user.id,
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
	rateLimit: {
		enabled: true,
		window: 60,
		max: 100,
	},
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

export type Session = typeof authClient.$Infer.Session;
