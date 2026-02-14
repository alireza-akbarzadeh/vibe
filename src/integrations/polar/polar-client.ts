import { Polar } from "@polar-sh/sdk";
import { env } from "@/env";

export const POLAR_PRODUCT_TO_PLAN: Record<string, string> = {
	[env.POLAR_FREE_PRODUCT_ID]: "FREE",
	[env.POLAR_PREMIUM_MONTHLY_PRODUCT_ID]: "PREMIUM",
	[env.POLAR_PREMIUM_YEARLY_PRODUCT_ID]: "PREMIUM",
	[env.POLAR_FAMILY_MONTHLY_PRODUCT_ID]: "FAMILY",
	[env.POLAR_FAMILY_YEARLY_PRODUCT_ID]: "FAMILY",
};

export const POLAR_SLUG_TO_PRODUCT: Record<string, string> = {
	Free: env.POLAR_FREE_PRODUCT_ID,
	"Premium-Monthly": env.POLAR_PREMIUM_MONTHLY_PRODUCT_ID,
	"Premium-Yearly": env.POLAR_PREMIUM_YEARLY_PRODUCT_ID,
	"Family-Monthly": env.POLAR_FAMILY_MONTHLY_PRODUCT_ID,
	"Family-Yearly": env.POLAR_FAMILY_YEARLY_PRODUCT_ID,
};

export const polarClient = new Polar({
	accessToken: env.POLAR_ACCESS_TOKEN,
});
