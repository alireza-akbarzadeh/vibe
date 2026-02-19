import { z } from "zod";
import { BaseEntitySchema } from "./core";

// Room schemas for watch-together functionality
export const RoomSchema = BaseEntitySchema.extend({
	name: z.string().min(1).max(100),
	description: z.string().nullable(),
	isPrivate: z.boolean().default(true),
	maxCapacity: z.number().int().positive().default(100),
	ownerId: z.string().cuid(),
	currentMediaId: z.string().cuid().nullable(),
	isActive: z.boolean().default(true),
	token: z.string().cuid(), // Host control token
});

export const RoomPublicSchema = RoomSchema.omit({
	token: true, // Never expose control token
});

export const RoomCreateSchema = RoomSchema.pick({
	name: true,
	description: true,
	isPrivate: true,
	maxCapacity: true,
	ownerId: true,
	currentMediaId: true,
});

export const RoomUpdateSchema = RoomSchema.partial().omit({
	id: true,
	ownerId: true,
	token: true,
	createdAt: true,
});

export type Room = z.infer<typeof RoomSchema>;
export type RoomPublic = z.infer<typeof RoomPublicSchema>;
export type RoomCreate = z.infer<typeof RoomCreateSchema>;
export type RoomUpdate = z.infer<typeof RoomUpdateSchema>;

// Room Member schemas
export const RoomMemberSchema = BaseEntitySchema.extend({
	roomId: z.string().cuid(),
	userId: z.string().cuid(),
	profileId: z.string().cuid().nullable(),
	isHost: z.boolean().default(false),
	isModerator: z.boolean().default(false),
	joinedAt: z.date().default(() => new Date()),
	lastSeenAt: z.date().default(() => new Date()),
	isActive: z.boolean().default(true),
});

export const RoomMemberPublicSchema = RoomMemberSchema.omit({
	// No sensitive fields to hide in this case
});

export const RoomMemberCreateSchema = RoomMemberSchema.pick({
	roomId: true,
	userId: true,
	profileId: true,
	isHost: true,
	isModerator: true,
});

export const RoomMemberUpdateSchema = RoomMemberSchema.partial().omit({
	id: true,
	roomId: true,
	userId: true,
	joinedAt: true,
	createdAt: true,
});

export type RoomMember = z.infer<typeof RoomMemberSchema>;
export type RoomMemberPublic = z.infer<typeof RoomMemberPublicSchema>;
export type RoomMemberCreate = z.infer<typeof RoomMemberCreateSchema>;
export type RoomMemberUpdate = z.infer<typeof RoomMemberUpdateSchema>;

// Playback State schemas for synchronization
export const PlaybackStateSchema = BaseEntitySchema.extend({
	roomId: z.string().cuid(),
	mediaId: z.string().cuid(),
	currentTime: z.number().default(0), // seconds
	duration: z.number().positive(), // seconds
	isPlaying: z.boolean().default(false),
	playbackRate: z.number().positive().default(1),
	volume: z.number().min(0).max(1).default(1),
	lastUpdatedBy: z.string().cuid(),
	lastUpdatedAt: z.date().default(() => new Date()),
	version: z.number().int().default(1), // For conflict resolution
});

export const PlaybackStatePublicSchema = PlaybackStateSchema.omit({
	// All fields are safe to expose
});

export const PlaybackStateCreateSchema = PlaybackStateSchema.pick({
	roomId: true,
	mediaId: true,
	currentTime: true,
	duration: true,
	isPlaying: true,
	playbackRate: true,
	volume: true,
	lastUpdatedBy: true,
});

export const PlaybackStateUpdateSchema = PlaybackStateSchema.partial().omit({
	id: true,
	roomId: true,
	mediaId: true,
	createdAt: true,
	version: true, // Version is handled internally
});

export type PlaybackState = z.infer<typeof PlaybackStateSchema>;
export type PlaybackStatePublic = z.infer<typeof PlaybackStatePublicSchema>;
export type PlaybackStateCreate = z.infer<typeof PlaybackStateCreateSchema>;
export type PlaybackStateUpdate = z.infer<typeof PlaybackStateUpdateSchema>;

// Playback Event schemas for real-time events
export const PlaybackEventSchema = BaseEntitySchema.extend({
	roomId: z.string().cuid(),
	userId: z.string().cuid(),
	eventType: z.enum([
		"PLAY",
		"PAUSE",
		"SEEK",
		"RATE_CHANGE",
		"VOLUME_CHANGE",
		"MEDIA_CHANGE",
	]),
	currentTime: z.number().nullable(),
	previousTime: z.number().nullable(),
	playbackRate: z.number().positive().nullable(),
	volume: z.number().min(0).max(1).nullable(),
	mediaId: z.string().cuid().nullable(),
	processed: z.boolean().default(false),
	processedAt: z.date().nullable(),
});

export const PlaybackEventCreateSchema = PlaybackEventSchema.pick({
	roomId: true,
	userId: true,
	eventType: true,
	currentTime: true,
	previousTime: true,
	playbackRate: true,
	volume: true,
	mediaId: true,
});

export type PlaybackEvent = z.infer<typeof PlaybackEventSchema>;
export type PlaybackEventCreate = z.infer<typeof PlaybackEventCreateSchema>;

// Chat Message schemas
export const ChatMessageSchema = BaseEntitySchema.extend({
	roomId: z.string().cuid(),
	userId: z.string().cuid(),
	profileId: z.string().cuid().nullable(),
	content: z.string().min(1).max(1000),
	type: z.enum(["TEXT", "EMOJI", "SYSTEM", "REACTION"]).default("TEXT"),
	parentId: z.string().cuid().nullable(), // For threaded messages
	isEdited: z.boolean().default(false),
	editedAt: z.date().nullable(),
	isDeleted: z.boolean().default(false),
	deletedAt: z.date().nullable(),
	reactions: z.record(z.number()).default({}), // emoji -> count
});

export const ChatMessagePublicSchema = ChatMessageSchema.omit({
	// All fields are safe to expose in public context
});

export const ChatMessageCreateSchema = ChatMessageSchema.pick({
	roomId: true,
	userId: true,
	profileId: true,
	content: true,
	type: true,
	parentId: true,
});

export const ChatMessageUpdateSchema = ChatMessageSchema.partial().omit({
	id: true,
	roomId: true,
	userId: true,
	profileId: true,
	parentId: true,
	createdAt: true,
	reactions: true, // Reactions handled separately
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatMessagePublic = z.infer<typeof ChatMessagePublicSchema>;
export type ChatMessageCreate = z.infer<typeof ChatMessageCreateSchema>;
export type ChatMessageUpdate = z.infer<typeof ChatMessageUpdateSchema>;

// Room Invite schemas for private room access
export const RoomInviteSchema = BaseEntitySchema.extend({
	roomId: z.string().cuid(),
	invitedBy: z.string().cuid(),
	email: z.string().email().nullable(),
	userId: z.string().cuid().nullable(),
	token: z.string().cuid(),
	expiresAt: z.date(),
	usedAt: z.date().nullable(),
	isActive: z.boolean().default(true),
});

export const RoomInviteCreateSchema = RoomInviteSchema.pick({
	roomId: true,
	invitedBy: true,
	email: true,
	userId: true,
	expiresAt: true,
});

export type RoomInvite = z.infer<typeof RoomInviteSchema>;
export type RoomInviteCreate = z.infer<typeof RoomInviteCreateSchema>;

// Plan schemas for capacity limits
export const PlanSchema = z.object({
	id: z.string(),
	name: z.string(),
	maxRooms: z.number().int().positive(),
	maxRoomCapacity: z.number().int().positive(),
	maxProfiles: z.number().int().positive(),
	features: z.array(z.string()),
	price: z.number().positive(),
	interval: z.enum(["month", "year"]),
});

export type Plan = z.infer<typeof PlanSchema>;

// WebSocket Connection schemas
export const WebSocketConnectionSchema = z.object({
	id: z.string(),
	userId: z.string().cuid().nullable(),
	profileId: z.string().cuid().nullable(),
	roomId: z.string().cuid().nullable(),
	sessionId: z.string(),
	connectedAt: z.date(),
	lastPingAt: z.date(),
	isActive: z.boolean().default(true),
});

export type WebSocketConnection = z.infer<typeof WebSocketConnectionSchema>;
