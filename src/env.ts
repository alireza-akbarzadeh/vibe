import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		SERVER_URL: z.string().url().optional(),
		DATABASE_URL: z.string().url(),
		BETTER_AUTH_URL: z.string().url(),
		BETTER_AUTH_SECRET: z.string().min(32),

		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1).optional(),

		// -----------------------------
		// 🔐 POLAR (Server Only)
		// -----------------------------
		POLAR_WEBHOOK_SECRET: z.string().min(1),
		POLAR_ACCESS_TOKEN: z.string().min(1),

		POLAR_SUCCESS_URL: z
			.string()
			.url()
			.refine(
				(url) => url.includes("{CHECKOUT_ID}"),
				"POLAR_SUCCESS_URL must include {CHECKOUT_ID}",
			),

		POLAR_FREE_PRODUCT_ID: z.string().uuid(),
		POLAR_FAMILY_MONTHLY_PRODUCT_ID: z.string().uuid(),
		POLAR_FAMILY_YEARLY_PRODUCT_ID: z.string().uuid(),
		POLAR_PREMIUM_YEARLY_PRODUCT_ID: z.string().uuid(),
		POLAR_PREMIUM_MONTHLY_PRODUCT_ID: z.string().uuid(),
	},

	/**
	 * Client-side env (Vite only)
	 */
	clientPrefix: "VITE_",

	client: {
		VITE_APP_TITLE: z.string().min(1).optional(),
		VITE_API_BASE_URL: z.string().url().optional(),
		VITE_CDN_ADDRESS: z.string().url().optional(),
		VITE_APP_URL: z.string().url().optional(),
	},

	runtimeEnv: {
		...process.env,
		...import.meta.env,
	},

	emptyStringAsUndefined: true,
});
