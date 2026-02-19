import { z } from "zod";

// Input schemas for user operations
export const UpdateUserInputSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	email: z.string().email().optional(),
	image: z.string().url().optional(),
	bio: z.string().max(500).optional(),
});

export const ChangePasswordInputSchema = z.object({
	currentPassword: z.string().min(8),
	newPassword: z.string().min(8),
});

export const SearchUsersInputSchema = z.object({
	query: z.string().min(1).max(100),
	page: z.number().int().min(1).optional().default(1),
	limit: z.number().int().min(1).max(100).optional().default(20),
});

export const GetUserByIdInputSchema = z.object({
	userId: z.string().cuid(),
});

// Type inference
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordInputSchema>;
export type SearchUsersInput = z.infer<typeof SearchUsersInputSchema>;
export type GetUserByIdInput = z.infer<typeof GetUserByIdInputSchema>;
