import { z } from "zod";

// Input schemas for room operations
export const CreateRoomInputSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(500).optional(),
	isPrivate: z.boolean().default(true),
	maxCapacity: z.number().int().positive().max(1000).optional(),
	ownerId: z.string().cuid(),
});

export const UpdateRoomInputSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().max(500).optional(),
	isPrivate: z.boolean().optional(),
});

export const JoinRoomInputSchema = z.object({
	roomId: z.string().cuid(),
	userId: z.string().cuid(),
});

export const LeaveRoomInputSchema = z.object({
	roomId: z.string().cuid(),
	userId: z.string().cuid(),
});

export const GetRoomMessagesInputSchema = z.object({
	roomId: z.string().cuid(),
	limit: z.number().int().min(1).max(100).optional().default(50),
	cursor: z.string().cuid().optional(),
	before: z.string().cuid().optional(),
	after: z.string().cuid().optional(),
});

export const SendMessageInputSchema = z.object({
	roomId: z.string().cuid(),
	userId: z.string().cuid(),
	profileId: z.string().cuid().optional(),
	content: z.string().min(1).max(1000),
	type: z.enum(["TEXT", "EMOJI", "SYSTEM", "REACTION"]).default("TEXT"),
	parentId: z.string().cuid().optional(),
});

export const UpdateMessageInputSchema = z.object({
	messageId: z.string().cuid(),
	userId: z.string().cuid(),
	content: z.string().min(1).max(1000),
});

export const DeleteMessageInputSchema = z.object({
	messageId: z.string().cuid(),
	userId: z.string().cuid(),
});

export const AddReactionInputSchema = z.object({
	messageId: z.string().cuid(),
	userId: z.string().cuid(),
	emoji: z.string().emoji(),
});

export const RemoveReactionInputSchema = z.object({
	messageId: z.string().cuid(),
	userId: z.string().cuid(),
	emoji: z.string().emoji(),
});

// Type inference
export type CreateRoomInput = z.infer<typeof CreateRoomInputSchema>;
export type UpdateRoomInput = z.infer<typeof UpdateRoomInputSchema>;
export type JoinRoomInput = z.infer<typeof JoinRoomInputSchema>;
export type LeaveRoomInput = z.infer<typeof LeaveRoomInputSchema>;
export type GetRoomMessagesInput = z.infer<typeof GetRoomMessagesInputSchema>;
export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;
export type UpdateMessageInput = z.infer<typeof UpdateMessageInputSchema>;
export type DeleteMessageInput = z.infer<typeof DeleteMessageInputSchema>;
export type AddReactionInput = z.infer<typeof AddReactionInputSchema>;
export type RemoveReactionInput = z.infer<typeof RemoveReactionInputSchema>;
