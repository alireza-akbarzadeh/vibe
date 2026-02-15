// server/users.functions.ts
import { client } from "@/orpc/client";

export type UserStatus =
	| "active"
	| "flagged"
	| "suspended"
	| "pending"
	| "deactivated";

export interface DeviceInfo {
	id: string;
	type: "Desktop" | "Mobile" | "Tablet" | "Unknown";
	lastSeen?: string;
	ip?: string;
}

export interface UserAccount {
	id: string;
	name: string;
	email: string;
	avatar: string;
	role: "Admin" | "Moderator" | "User" | "ADMIN" | "MODERATOR" | "USER";
	status: UserStatus;
	plan: "Free" | "Standard" | "Premium" | "FREE" | "PRO" | "PREMIUM" | "CANCELLED";
	joinedDate: string;
	createdAt?: string;
	updatedAt?: string;
	phone?: string;
	phoneVerified?: boolean;
	emailVerified?: boolean;
	twoFactorEnabled?: boolean;
	mfaMethods?: string[];
	failedLoginAttempts?: number;
	lockedUntil?: string | null;
	lastPasswordChange?: string;
	lastLogin?: string;
	lastSeenAt?: string;
	sessionsActive?: number;
	devices?: DeviceInfo[];
	address?: string;
	city?: string;
	country?: string;
	locale?: string;
	timezone?: string;
	usage?: number;
	storageUsedMB?: number;
	streamingHours?: number;
	playlistsCount?: number;
	billingStatus?: "active" | "past_due" | "cancelled" | "trialing";
	subscriptionEnd?: string | null;
	accountBalance?: number;
	credits?: number;
	profileComplete?: number;
	tags?: string[];
	notes?: string;
	organization?: string;
	manager?: string;
	joinedAt?: string;
	banned?: boolean;
	agreeToTerms?: boolean;
}

/**
 * Fetch users from the real database via ORPC
 */
export async function getUsers(): Promise<UserAccount[]> {
	try {
		const response = await client.user.listUsers({
			page: 1,
			limit: 100,
		});

		// Transform database users to UserAccount format
		return response.users.map((user) => {
			let status: UserStatus = "active";
			if (user.banned) {
				status = "suspended";
			} else if (!user.emailVerified) {
				status = "pending";
			}

			// Map subscription status to plan
			const planMap: Record<string, "Free" | "Standard" | "Premium"> = {
				FREE: "Free",
				PRO: "Standard",
				PREMIUM: "Premium",
				CANCELLED: "Free",
			};

			return {
				id: user.id,
				name: user.name || "Unknown User",
				email: user.email,
				avatar: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
				role: user.role as "ADMIN" | "MODERATOR" | "USER",
				status,
				plan: planMap[user.subscriptionStatus] || "Free",
				joinedDate: user.createdAt.toISOString(),
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
				emailVerified: user.emailVerified,
				twoFactorEnabled: user.twoFactorEnabled,
				banned: user.banned,
				agreeToTerms: user.agreeToTerms,
			};
		});
	} catch (error) {
		console.error("Failed to fetch users:", error);
		throw new Error("Failed to fetch users from database");
	}
}

