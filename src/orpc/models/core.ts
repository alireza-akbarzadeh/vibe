import { z } from "zod";

// Base schemas for common fields
export const BaseEntitySchema = z.object({
	id: z.string().cuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const BaseUserEntitySchema = BaseEntitySchema.extend({
	userId: z.string().cuid(),
});

// User schemas
export const UserSchema = z.object({
	id: z.string().cuid(),
	email: z.string().email(),
	emailVerified: z.boolean().default(false),
	name: z.string().nullable(),
	image: z.string().nullable(),
	password: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	twoFactorEnabled: z.boolean().default(false),
	role: z.string().default("USER"),
	banned: z.boolean().default(false),
	agreeToTerms: z.boolean().default(false),
	subscriptionStatus: z
		.enum(["FREE", "PREMIUM", "FAMILY", "CANCELLED"])
		.default("FREE"),
	currentPlan: z.string().nullable(),
	customerId: z.string().nullable(),
});

export const UserPublicSchema = UserSchema.pick({
	id: true,
	email: true,
	name: true,
	image: true,
	role: true,
	subscriptionStatus: true,
	currentPlan: true,
	createdAt: true,
});

export const UserPrivateSchema = UserSchema.omit({
	password: true,
});

export type User = z.infer<typeof UserSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
export type UserPrivate = z.infer<typeof UserPrivateSchema>;

// Profile schemas
export const ProfileSchema = BaseUserEntitySchema.extend({
	name: z.string(),
	image: z.string().nullable(),
	pin: z.string().nullable(),
	isKids: z.boolean().default(false),
	language: z.string().default("en"),
});

export const ProfileCreateSchema = ProfileSchema.pick({
	userId: true,
	name: true,
	image: true,
	pin: true,
	isKids: true,
	language: true,
});

export const ProfileUpdateSchema = ProfileSchema.partial().omit({
	id: true,
	userId: true,
	createdAt: true,
});

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileCreate = z.infer<typeof ProfileCreateSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;

// Media schemas
export const MediaSchema = BaseEntitySchema.extend({
	title: z.string(),
	description: z.string(),
	thumbnail: z.string(),
	videoUrl: z.string().nullable(),
	audioUrl: z.string().nullable(),
	duration: z.number().int().positive(),
	releaseYear: z.number().int(),
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]),
	collectionId: z.string().cuid().nullable(),
	sortOrder: z.number().int().nullable(),
	status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "REJECTED"]).default("DRAFT"),
	rating: z.number().nullable().default(0),
	reviewCount: z.number().int().default(0),
	criticalScore: z.number().nullable().default(0),
	viewCount: z.number().int().default(0),
});

export const MediaPublicSchema = MediaSchema.omit({
	videoUrl: true,
	audioUrl: true,
});

export const MediaCreateSchema = MediaSchema.pick({
	title: true,
	description: true,
	thumbnail: true,
	videoUrl: true,
	audioUrl: true,
	duration: true,
	releaseYear: true,
	type: true,
	collectionId: true,
	sortOrder: true,
});

export const MediaUpdateSchema = MediaSchema.partial().omit({
	id: true,
	createdAt: true,
	viewCount: true,
	reviewCount: true,
});

export type Media = z.infer<typeof MediaSchema>;
export type MediaPublic = z.infer<typeof MediaPublicSchema>;
export type MediaCreate = z.infer<typeof MediaCreateSchema>;
export type MediaUpdate = z.infer<typeof MediaUpdateSchema>;

// Person schemas
export const PersonSchema = BaseEntitySchema.extend({
	tmdbId: z.number().int().positive(),
	adult: z.boolean().default(false),
	gender: z.number().int().nullable().default(0),
	knownForDepartment: z.string().max(100).nullable(),
	name: z.string().max(255),
	originalName: z.string().max(255),
	popularity: z.number().default(0.0),
	profilePath: z.string().max(500).nullable(),
});

export type Person = z.infer<typeof PersonSchema>;

// Genre schemas
export const GenreSchema = BaseEntitySchema.extend({
	name: z.string(),
	description: z.string().nullable(),
	type: z.enum(["MOVIE", "EPISODE", "TRACK"]).default("MOVIE"),
});

export const GenreCreateSchema = GenreSchema.pick({
	name: true,
	description: true,
	type: true,
});

export const GenreUpdateSchema = GenreSchema.partial().omit({
	id: true,
	createdAt: true,
});

export type Genre = z.infer<typeof GenreSchema>;
export type GenreCreate = z.infer<typeof GenreCreateSchema>;
export type GenreUpdate = z.infer<typeof GenreUpdateSchema>;

// Collection schemas
export const CollectionSchema = BaseEntitySchema.extend({
	title: z.string(),
	description: z.string().nullable(),
	thumbnail: z.string().nullable(),
	type: z.enum(["SERIES", "ALBUM", "PLAYLIST"]),
});

export const CollectionCreateSchema = CollectionSchema.pick({
	title: true,
	description: true,
	thumbnail: true,
	type: true,
});

export const CollectionUpdateSchema = CollectionSchema.partial().omit({
	id: true,
	createdAt: true,
});

export type Collection = z.infer<typeof CollectionSchema>;
export type CollectionCreate = z.infer<typeof CollectionCreateSchema>;
export type CollectionUpdate = z.infer<typeof CollectionUpdateSchema>;

// Creator schemas
export const CreatorSchema = BaseEntitySchema.extend({
	name: z.string(),
	bio: z.string().nullable(),
	image: z.string().nullable(),
	birthDate: z.date().nullable(),
});

export const CreatorCreateSchema = CreatorSchema.pick({
	name: true,
	bio: true,
	image: true,
	birthDate: true,
});

export const CreatorUpdateSchema = CreatorSchema.partial().omit({
	id: true,
	createdAt: true,
});

export type Creator = z.infer<typeof CreatorSchema>;
export type CreatorCreate = z.infer<typeof CreatorCreateSchema>;
export type CreatorUpdate = z.infer<typeof CreatorUpdateSchema>;

// Viewing History schemas
export const ViewingHistorySchema = BaseUserEntitySchema.extend({
	profileId: z.string().cuid(),
	mediaId: z.string().cuid(),
	progress: z.number().int().min(0).max(100),
	completed: z.boolean().default(false),
	viewedAt: z.date().default(() => new Date()),
	lastWatchedAt: z.date().default(() => new Date()),
});

export const ViewingHistoryCreateSchema = ViewingHistorySchema.pick({
	profileId: true,
	mediaId: true,
	progress: true,
	completed: true,
});

export const ViewingHistoryUpdateSchema = ViewingHistorySchema.partial().omit({
	id: true,
	profileId: true,
	mediaId: true,
	createdAt: true,
});

export type ViewingHistory = z.infer<typeof ViewingHistorySchema>;
export type ViewingHistoryCreate = z.infer<typeof ViewingHistoryCreateSchema>;
export type ViewingHistoryUpdate = z.infer<typeof ViewingHistoryUpdateSchema>;

// Favorite schemas
export const FavoriteSchema = BaseUserEntitySchema.extend({
	mediaId: z.string().cuid(),
});

export const FavoriteCreateSchema = FavoriteSchema.pick({
	userId: true,
	mediaId: true,
});

export type Favorite = z.infer<typeof FavoriteSchema>;
export type FavoriteCreate = z.infer<typeof FavoriteCreateSchema>;

// Watchlist schemas
export const WatchListSchema = BaseUserEntitySchema.extend({
	mediaId: z.string().cuid(),
});

export const WatchListCreateSchema = WatchListSchema.pick({
	userId: true,
	mediaId: true,
});

export type WatchList = z.infer<typeof WatchListSchema>;
export type WatchListCreate = z.infer<typeof WatchListCreateSchema>;

// Review schemas
export const UserReviewSchema = BaseUserEntitySchema.extend({
	mediaId: z.string().cuid(),
	rating: z.number().min(1).max(10),
	review: z.string().nullable(),
	helpful: z.number().int().default(0),
});

export const UserReviewCreateSchema = UserReviewSchema.pick({
	userId: true,
	mediaId: true,
	rating: true,
	review: true,
});

export const UserReviewUpdateSchema = UserReviewSchema.partial().omit({
	id: true,
	userId: true,
	mediaId: true,
	createdAt: true,
});

export type UserReview = z.infer<typeof UserReviewSchema>;
export type UserReviewCreate = z.infer<typeof UserReviewCreateSchema>;
export type UserReviewUpdate = z.infer<typeof UserReviewUpdateSchema>;

// Subscription schemas
export const SubscriptionSchema = BaseUserEntitySchema.extend({
	productId: z.string(),
	referenceId: z.string().nullable(),
	redirectUrl: z.string().nullable(),
	status: z.enum(["FREE", "PREMIUM", "FAMILY", "CANCELLED"]),
	startedAt: z.date().default(() => new Date()),
	endedAt: z.date().nullable(),
	canceledAt: z.date().nullable(),
});

export const SubscriptionCreateSchema = SubscriptionSchema.pick({
	userId: true,
	productId: true,
	referenceId: true,
	redirectUrl: true,
	status: true,
	startedAt: true,
	endedAt: true,
	canceledAt: true,
});

export const SubscriptionUpdateSchema = SubscriptionSchema.partial().omit({
	id: true,
	userId: true,
	createdAt: true,
});

export type Subscription = z.infer<typeof SubscriptionSchema>;
export type SubscriptionCreate = z.infer<typeof SubscriptionCreateSchema>;
export type SubscriptionUpdate = z.infer<typeof SubscriptionUpdateSchema>;

// Role and Permission schemas
export const RoleSchema = BaseEntitySchema.extend({
	name: z.string(),
	description: z.string().nullable(),
});

export const PermissionSchema = BaseEntitySchema.extend({
	name: z.string(),
	description: z.string().nullable(),
	resource: z.string(),
	action: z.string(),
});

export type Role = z.infer<typeof RoleSchema>;
export type Permission = z.infer<typeof PermissionSchema>;

// Audit Log schemas
export const AuditLogSchema = BaseUserEntitySchema.extend({
	action: z.string(),
	resource: z.string(),
	resourceId: z.string().nullable(),
	metadata: z.record(z.unknown()).nullable(),
});

export const AuditLogCreateSchema = AuditLogSchema.pick({
	userId: true,
	action: true,
	resource: true,
	resourceId: true,
	metadata: true,
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditLogCreate = z.infer<typeof AuditLogCreateSchema>;
