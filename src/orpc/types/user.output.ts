import { z } from "zod";

// Output schemas for user operations
export const UserPublicSchema = z.object({
	id: z.string().cuid(),
	email: z.string().email(),
	name: z.string(),
	image: z.string().url().nullable(),
	role: z.enum(["USER", "ADMIN", "MODERATOR"]),
	subscriptionStatus: z.enum(["ACTIVE", "INACTIVE", "CANCELLED", "EXPIRED"]),
	currentPlan: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const UserPrivateSchema = UserPublicSchema.extend({
	bio: z.string().max(500).nullable(),
	emailVerified: z.date().nullable(),
	twoFactorEnabled: z.boolean(),
	lastLoginAt: z.date().nullable(),
});

export const UserProfileSchema = z.object({
	id: z.string().cuid(),
	userId: z.string().cuid(),
	bio: z.string().max(500).nullable(),
	avatar: z.string().url().nullable(),
	preferences: z.record(z.string(), z.any()).optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const UserStatsSchema = z.object({
	totalUsers: z.number().int().nonnegative(),
	activeUsers: z.number().int().nonnegative(),
	premiumUsers: z.number().int().nonnegative(),
	newUsersThisMonth: z.number().int().nonnegative(),
});

// Type inference
export type UserPublic = z.infer<typeof UserPublicSchema>;
export type UserPrivate = z.infer<typeof UserPrivateSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
