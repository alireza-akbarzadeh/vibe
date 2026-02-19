import type { Prisma } from "@prisma/client";
import type { User } from "@/orpc/models/core";

import { db } from "@/server/db";

export interface UserQueryOptions {
	select?: Prisma.UserSelect;
	skip?: number;
	take?: number;
	orderBy?: Prisma.UserOrderByWithRelationInput;
	include?: Prisma.UserInclude;
}

export interface UserListOptions extends UserQueryOptions {
	limit?: number;
	where?: Prisma.UserWhereInput;
	cursor?: string;
	include?: Prisma.UserInclude;
}

export interface UserStats {
	totalUsers: number;
	activeUsers: number;
	premiumUsers: number;
	freeUsers: number;
}

export class UserRepository {
	/**
	 * Find user by ID
	 */
	async findById(
		id: string,
		options: UserQueryOptions = {},
	): Promise<User | null> {
		const { select } = options;

		return await db.client.user.findUnique({
			where: { id },
			select: select || {
				id: true,
				email: true,
				emailVerified: true,
				name: true,
				image: true,
				role: true,
				subscriptionStatus: true,
				currentPlan: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	/**
	 * Find user by email
	 */
	async findByEmail(
		email: string,
		options: UserQueryOptions = {},
	): Promise<User | null> {
		const { select } = options;

		return await db.client.user.findUnique({
			where: { email },
			select: select || {
				id: true,
				email: true,
				emailVerified: true,
				name: true,
				image: true,
				password: true,
				role: true,
				subscriptionStatus: true,
				currentPlan: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	/**
	 * Find users with pagination
	 */
	async findMany(options: UserListOptions = {}): Promise<User[]> {
		const { limit = 20, select, orderBy, cursor } = options;

		return await db.client.user.findMany({
			take: limit,
			...(cursor && { cursor: { id: cursor } }),
			select: select || {
				id: true,
				email: true,
				emailVerified: true,
				name: true,
				image: true,
				role: true,
				subscriptionStatus: true,
				currentPlan: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: orderBy || { createdAt: "desc" },
		});
	}

	/**
	 * Create new user
	 */
	async create(data: Prisma.UserCreateInput): Promise<User> {
		return await db.client.user.create({ data });
	}

	/**
	 * Update user
	 */
	async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
		return await db.client.user.update({
			where: { id },
			data,
		});
	}

	/**
	 * Delete user
	 */
	async delete(id: string): Promise<User> {
		return await db.client.user.delete({ where: { id } });
	}

	/**
	 * Count users with filters
	 */
	async count(where: Prisma.UserWhereInput = {}): Promise<number> {
		return await db.client.user.count({ where });
	}

	/**
	 * Get user statistics
	 */
	async getStats(): Promise<UserStats> {
		const [totalUsers, activeUsers, premiumUsers, freeUsers] =
			await Promise.all([
				this.count(),
				this.count({ emailVerified: true }),
				this.count({ subscriptionStatus: { in: ["PREMIUM", "FAMILY"] } }),
				this.count({ subscriptionStatus: "FREE" }),
			]);

		return {
			totalUsers,
			activeUsers,
			premiumUsers,
			freeUsers,
		};
	}

	/**
	 * Find users by subscription status
	 */
	async findBySubscriptionStatus(
		_status: "FREE" | "PREMIUM" | "FAMILY" | "CANCELLED",
		options: UserListOptions = {},
	): Promise<User[]> {
		return await this.findMany({
			...options,
		});
	}

	/**
	 * Find users with roles
	 */
	async findWithRoles(options: UserListOptions = {}): Promise<User[]> {
		return await this.findMany({
			...options,
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
		});
	}

	/**
	 * Find users with permissions
	 */
	async findWithPermissions(options: UserListOptions = {}): Promise<User[]> {
		return await this.findMany({
			...options,
			include: {
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});
	}

	/**
	 * Check if user has permission
	 */
	async hasPermission(
		userId: string,
		resource: string,
		action: string,
	): Promise<boolean> {
		const user = await db.client.user.findUnique({
			where: { id: userId },
			include: {
				roles: {
					include: {
						role: {
							include: {
								permissions: {
									include: {
										permission: true,
									},
								},
							},
						},
					},
				},
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});

		if (!user) return false;

		// Check direct permissions
		const hasDirectPermission = user.permissions.some(
			(up) =>
				up.permission.resource === resource && up.permission.action === action,
		);

		if (hasDirectPermission) return true;

		// Check role-based permissions
		return user.roles.some((userRole) =>
			userRole.role.permissions.some(
				(rolePermission) =>
					rolePermission.permission.resource === resource &&
					rolePermission.permission.action === action,
			),
		);
	}

	/**
	 * Get user with full profile data
	 */
	async getFullProfile(userId: string): Promise<User | null> {
		return await this.findById(userId, {
			include: {
				profiles: true,
				subscriptions: {
					orderBy: { startedAt: "desc" },
					take: 1,
				},
				roles: {
					include: {
						role: true,
					},
				},
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});
	}

	/**
	 * Bulk create users
	 */
	async bulkCreate(users: Prisma.UserCreateManyInput[]): Promise<number> {
		const result = await db.client.user.createMany({
			data: users,
			skipDuplicates: true,
		});
		return result.count;
	}

	/**
	 * Search users
	 */
	async search(query: string, options: UserListOptions = {}): Promise<User[]> {
		return await this.findMany({
			...options,
			where: {
				OR: [
					{ email: { contains: query, mode: "insensitive" } },
					{ name: { contains: query, mode: "insensitive" } },
				],
			},
		});
	}
}
