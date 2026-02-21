import { z } from "zod";

import type { User, UserPrivate, UserPublic } from "@/orpc/models/core";
import type { RoomPublic } from "@/orpc/models/streaming";
import { RoomRepository } from "@/server/repositories/room.repository";
import { UserRepository } from "@/server/repositories/user.repository";

// Service-level schemas for input validation
const CreateUserSchema = z.object({
	email: z.string().email(),
	name: z.string().optional(),
	password: z.string().min(8).optional(),
});

const UpdateUserSchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional(),
	image: z.string().url().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// Service-level error types
export class UserServiceError extends Error {
	constructor(
		message: string,
		public code: string,
	) {
		super(message);
		this.name = "UserServiceError";
	}
}

export class UserNotFoundError extends UserServiceError {
	constructor(userId: string) {
		super(`User ${userId} not found`, "USER_NOT_FOUND");
	}
}

export class UserAlreadyExistsError extends UserServiceError {
	constructor(email: string) {
		super(`User with email ${email} already exists`, "USER_ALREADY_EXISTS");
	}
}

export class InvalidUserDataError extends UserServiceError {
	constructor(message: string) {
		super(message, "INVALID_USER_DATA");
	}
}

export class UserService {
	constructor(
		private userRepository: UserRepository = new UserRepository(),
		private roomRepository: RoomRepository = new RoomRepository(),
	) {}

	/**
	 * Create a new user
	 */
	async createUser(input: CreateUserInput): Promise<User> {
		// Validate input
		const validationResult = CreateUserSchema.safeParse(input);
		if (!validationResult.success) {
			throw new InvalidUserDataError(validationResult.error.message);
		}

		// Check if user already exists
		const existingUser = await this.userRepository.findByEmail(input.email);
		if (existingUser) {
			throw new UserAlreadyExistsError(input.email);
		}

		// Create user
		return await this.userRepository.create({
			email: input.email,
			name: input.name,
			password: input.password,
		});
	}

	/**
	 * Get user by ID
	 */
	async getUserById(userId: string): Promise<User> {
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new UserNotFoundError(userId);
		}
		return user;
	}

	/**
	 * Get user by email
	 */
	async getUserByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			throw new UserNotFoundError(email);
		}
		return user;
	}

	/**
	 * Get public user data (safe for API responses)
	 */
	async getPublicUserData(userId: string): Promise<UserPublic> {
		const user = await this.getUserById(userId);
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			image: user.image,
			role: user.role,
			subscriptionStatus: user.subscriptionStatus,
			currentPlan: user.currentPlan,
			createdAt: user.createdAt,
		};
	}

	/**
	 * Get user with full profile data
	 */
	async getPrivateUserData(userId: string): Promise<UserPrivate> {
		const user = await this.userRepository.getFullProfile(userId);
		if (!user) {
			throw new UserNotFoundError(userId);
		}

		// Remove password from response
		const { ...userWithoutPassword } = user;
		return userWithoutPassword as UserPrivate;
	}

	/**
	 * Update user
	 */
	async updateUser(userId: string, input: UpdateUserInput): Promise<User> {
		// Validate input
		const validationResult = UpdateUserSchema.safeParse(input);
		if (!validationResult.success) {
			throw new InvalidUserDataError(validationResult.error.message);
		}

		// Check if user exists
		await this.getUserById(userId);

		// Update user
		return await this.userRepository.update(userId, input);
	}

	/**
	 * Delete user
	 */
	async deleteUser(userId: string): Promise<void> {
		await this.getUserById(userId); // Verify user exists
		await this.userRepository.delete(userId);
	}

	/**
	 * Get user statistics
	 */
	async getUserStats(): Promise<{
		totalUsers: number;
		activeUsers: number;
		premiumUsers: number;
		freeUsers: number;
	}> {
		return await this.userRepository.getStats();
	}

	/**
	 * List users with pagination
	 */
	async listUsers(options: { limit?: number; cursor?: string } = {}): Promise<{
		users: UserPublic[];
		nextCursor?: string;
	}> {
		const { limit = 20, cursor } = options;

		const users = await this.userRepository.findMany({
			limit: limit + 1,
			cursor,
		});

		let nextCursor: string | undefined;
		if (users.length > limit) {
			const nextItem = users.pop();
			nextCursor = nextItem?.id;
		}

		return {
			users: users.map((user) => ({
				id: user.id,
				email: user.email,
				name: user.name,
				image: user.image,
				role: user.role,
				subscriptionStatus: user.subscriptionStatus,
				currentPlan: user.currentPlan,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			})),
			nextCursor,
		};
	}

	/**
	 * Search users
	 */
	async search(
		query: string,
		options: {
			limit?: number;
		} = {},
	): Promise<UserPublic[]> {
		const { limit = 20 } = options;
		const users = await this.userRepository.search(query, { limit });
		return users.map((user) => ({
			id: user.id,
			email: user.email,
			name: user.name,
			image: user.image,
			role: user.role,
			subscriptionStatus: user.subscriptionStatus,
			currentPlan: user.currentPlan,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}));
	}

	/**
	 * Check user permissions
	 */
	async hasPermission(
		userId: string,
		resource: string,
		action: string,
	): Promise<boolean> {
		return await this.userRepository.hasPermission(userId, resource, action);
	}

	/**
	 * Get user subscription status
	 */
	async getSubscriptionStatus(userId: string): Promise<{
		status: "FREE" | "PREMIUM" | "FAMILY" | "CANCELLED";
		currentPlan: string | null;
		isActive: boolean;
	}> {
		const user = await this.getUserById(userId);
		return {
			status: user.subscriptionStatus,
			currentPlan: user.currentPlan,
			isActive: user.subscriptionStatus !== "CANCELLED",
		};
	}

	/**
	 * Update user subscription
	 */
	async updateSubscription(
		userId: string,
		status: "FREE" | "PREMIUM" | "FAMILY" | "CANCELLED",
		currentPlan?: string,
	): Promise<User> {
		return await this.userRepository.update(userId, {
			subscriptionStatus: status,
			currentPlan: currentPlan || undefined,
		});
	}

	/**
	 * Bulk create users (for admin operations)
	 */
	async bulkCreateUsers(users: CreateUserInput[]): Promise<number> {
		const validUsers = users.filter((user) => {
			const result = CreateUserSchema.safeParse(user);
			return result.success;
		});

		if (validUsers.length === 0) {
			throw new InvalidUserDataError("No valid users provided");
		}

		return await this.userRepository.bulkCreate(validUsers);
	}

	/**
	 * Get user rooms
	 */
	async getUserRooms(userId: string): Promise<RoomPublic[]> {
		return await this.roomRepository.findByUserId(userId);
	}
}
