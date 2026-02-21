import { z } from "zod";

// Output schemas for room operations
export const RoomPublicOutputSchema = z.object({
	id: z.cuid(),
	name: z.string(),
	description: z.string().nullable(),
	isPrivate: z.boolean(),
	maxCapacity: z.number().int().positive(),
	ownerId: z.cuid(),
	currentMediaId: z.string().cuid().nullable(),
	isActive: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const RoomMemberOutputSchema = z.object({
	id: z.cuid(),
	roomId: z.cuid(),
	userId: z.cuid(),
	profileId: z.string().cuid().nullable(),
	isHost: z.boolean(),
	joinedAt: z.date(),
	lastSeenAt: z.date().nullable(),
	isActive: z.boolean(),
});

export const ChatMessageOutputSchema = z.object({
	id: z.cuid(),
	roomId: z.cuid(),
	userId: z.cuid(),
	profileId: z.string().cuid().nullable(),
	content: z.string(),
	type: z.enum(["TEXT", "EMOJI", "SYSTEM", "REACTION"]),
	parentId: z.string().cuid().nullable(),
	isEdited: z.boolean(),
	editedAt: z.date().nullable(),
	isDeleted: z.boolean(),
	deletedAt: z.date().nullable(),
	reactions: z.record(z.string(), z.number()),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const PlaybackStateOutputSchema = z.object({
	id: z.cuid(),
	roomId: z.cuid(),
	mediaId: z.cuid().nullable(),
	currentTime: z.number().nonnegative(),
	isPlaying: z.boolean(),
	playbackRate: z.number().positive(),
	lastUpdatedBy: z.cuid(),
	version: z.number().int().nonnegative(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const RoomListOutputSchema = z.object({
	rooms: z.array(RoomPublicOutputSchema),
	total: z.number().int().nonnegative(),
	page: z.number().int().positive(),
	limit: z.number().int().positive(),
	totalPages: z.number().int().positive(),
});

export const RoomMembersOutputSchema = z.object({
	members: z.array(RoomMemberOutputSchema),
	total: z.number().int().nonnegative(),
});

export const ChatMessagesOutputSchema = z.object({
	messages: z.array(ChatMessageOutputSchema),
	hasMore: z.boolean(),
	cursor: z.string().cuid().optional(),
});

export const JoinRoomOutputSchema = z.object({
	memberId: z.string().cuid(),
	roomId: z.string().cuid(),
	userId: z.string().cuid(),
	joinedAt: z.date(),
});

// Type inference
export type RoomPublicOutput = z.infer<typeof RoomPublicOutputSchema>;
export type RoomMemberOutput = z.infer<typeof RoomMemberOutputSchema>;
export type ChatMessageOutput = z.infer<typeof ChatMessageOutputSchema>;
export type PlaybackStateOutput = z.infer<typeof PlaybackStateOutputSchema>;
export type RoomListOutput = z.infer<typeof RoomListOutputSchema>;
export type RoomMembersOutput = z.infer<typeof RoomMembersOutputSchema>;
export type ChatMessagesOutput = z.infer<typeof ChatMessagesOutputSchema>;
export type JoinRoomOutput = z.infer<typeof JoinRoomOutputSchema>;
