import { env } from "@/env";
import { createServerFn } from "@tanstack/react-start";

type Price = {
	amount: number;
	interval: "month" | "year";
};

export type PlanSlug =
	| "free"
	| "premium-monthly"
	| "premium-yearly"
	| "family-monthly"
	| "family-yearly";

export interface PlanType {
	name: "Free" | "Premium" | "Family";
	slug: PlanSlug;
	icon: string;
	price: Price;
	description: string;
	features: string[];
	cta: string;
	popular: boolean;
	gradient: string;
	glowColor: string;
	productId: string;
}

export const getPlans = createServerFn({ method: "GET" }).handler(async () => {
	const plans: PlanType[] = [
		// -----------------------
		// FREE
		// -----------------------
		{
			name: "Free",
			slug: "free",
			icon: "Sparkles",
			price: { amount: 0, interval: "month" },
			description: "Perfect for casual listeners",
			features: [
				"Limited music streaming",
				"Ad-supported movies",
				"Standard quality",
				"1 device",
				"Basic recommendations",
			],
			cta: "Start Free Trial",
			popular: false,
			gradient: "from-gray-600 to-gray-700",
			glowColor: "gray-500",
			productId: env.POLAR_FREE_PRODUCT_ID,
		},

		// -----------------------
		// PREMIUM — MONTHLY
		// -----------------------
		{
			name: "Premium",
			slug: "premium-monthly",
			icon: "Zap",
			price: { amount: 9.99, interval: "month" },
			description: "Best for individuals",
			features: [
				"Unlimited music streaming",
				"Ad-free movies & shows",
				"HD quality",
				"Up to 3 devices",
				"Offline downloads",
				"AI-powered recommendations",
			],
			cta: "Get Premium",
			popular: true,
			gradient: "from-purple-600 to-pink-600",
			glowColor: "purple-500",
			productId: env.POLAR_PREMIUM_MONTHLY_PRODUCT_ID,
		},

		// -----------------------
		// PREMIUM — YEARLY
		// -----------------------
		{
			name: "Premium",
			slug: "premium-yearly",
			icon: "Zap",
			price: { amount: 99, interval: "year" },
			description: "Best value for individuals",
			features: [
				"Everything in Premium Monthly",
				"Save over 15%",
				"Priority updates",
			],
			cta: "Save with Annual",
			popular: false,
			gradient: "from-purple-600 to-pink-600",
			glowColor: "purple-500",
			productId: env.POLAR_PREMIUM_YEARLY_PRODUCT_ID,
		},

		// -----------------------
		// FAMILY — MONTHLY
		// -----------------------
		{
			name: "Family",
			slug: "family-monthly",
			icon: "Crown",
			price: { amount: 14.99, interval: "month" },
			description: "Perfect for the whole family",
			features: [
				"Up to 6 family members",
				"Individual profiles",
				"4K Ultra HD quality",
				"Parental controls",
			],
			cta: "Get Family",
			popular: false,
			gradient: "from-cyan-600 to-blue-600",
			glowColor: "cyan-500",
			productId: env.POLAR_FAMILY_MONTHLY_PRODUCT_ID,
		},

		// -----------------------
		// FAMILY — YEARLY
		// -----------------------
		{
			name: "Family",
			slug: "family-yearly",
			icon: "Crown",
			price: { amount: 149, interval: "year" },
			description: "Best value for families",
			features: [
				"Everything in Family Monthly",
				"Save over 20%",
				"Priority family support",
			],
			cta: "Save With Annual",
			popular: false,
			gradient: "from-cyan-600 to-blue-600",
			glowColor: "cyan-500",
			productId: env.POLAR_FAMILY_YEARLY_PRODUCT_ID,
		},
	];

	return { plans };
});
