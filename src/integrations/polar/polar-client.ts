import { Polar } from "@polar-sh/sdk";
import { env } from "process";


export const POLAR_PRODUCT_TO_PLAN: Record<string, string> = {
  [env.POLAR_FREE_PRODUCT_ID as string]: "FREE",
  [env.POLAR_PREMIUM_MONTHLY_PRODUCT_ID as string]: "PREMIUM",
  [env.POLAR_PREMIUM_YEARLY_PRODUCT_ID as string]: "PREMIUM",
  [env.POLAR_FAMILY_MONTHLY_PRODUCT_ID as string]: "FAMILY",
  [env.POLAR_FAMILY_YEARLY_PRODUCT_ID as string]: "FAMILY",
};

export const POLAR_SLUG_TO_PRODUCT: Record<string, string> = {
  "Free": env.POLAR_FREE_PRODUCT_ID as string,
  "Premium-Monthly": env.POLAR_PREMIUM_MONTHLY_PRODUCT_ID as string,
  "Premium-Yearly": env.POLAR_PREMIUM_YEARLY_PRODUCT_ID as string,
  "Family-Monthly": env.POLAR_FAMILY_MONTHLY_PRODUCT_ID as string,
  "Family-Yearly": env.POLAR_FAMILY_YEARLY_PRODUCT_ID as string,
};

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN
});

