export const Roles = ["ADMIN", "MODERATOR", "USER"] as const;

export type Role = (typeof Roles)[number];

export const SubscriptionStatuses = [
	"ACTIVE",
	"PAST_DUE",
	"CANCELLED",
	"EXPIRED",
	"TRIALING",
] as const;

export type SubscriptionStatus = (typeof SubscriptionStatuses)[number];

export const Tiers = ["FREE", "PRO", "CANCELLED"] as const;

export type Tier = (typeof Tiers)[number];
