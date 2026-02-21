import { SubscriptionStatus } from "@prisma/client";

export const Roles = ["ADMIN", "MODERATOR", "USER"] as const;

export type Role = (typeof Roles)[number];

export const SubscriptionStatuses = [
	"ACTIVE",
	"PAST_DUE",
	"CANCELLED",
	"EXPIRED",
	"TRIALING",
] as const;

// You can re-export or create aliases if needed

// If you want to keep your Tier concept for business logic
export const Tiers = ["FREE", "PREMIUM", "FAMILY", "CANCELLED"] as const;
export type Tier = (typeof Tiers)[number];

// Map Prisma enum to your Tier type if needed
export const prismaToTierMap: Record<SubscriptionStatus, Tier> = {
	FREE: "FREE",
	PREMIUM: "PREMIUM",
	FAMILY: "FAMILY",
	CANCELLED: "CANCELLED",
};
