import { z } from "zod";
import type {
	PlaybackState,
	PlaybackStateUpdate,
	Room,
	RoomCreate,
	RoomMember,
	RoomMemberPublic,
	RoomPublic,
} from "@/orpc/models/streaming";
import { RoomRepository } from "@/server/repositories/room.repository";
import { UserRepository } from "@/server/repositories/user.repository";

// Service-level schemas for input validation
const CreateRoomSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().optional(),
	isPrivate: z.boolean().default(true),
	maxCapacity: z.number().int().positive().optional(),
	ownerId: z.string().cuid(),
});

const UpdateRoomSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().optional(),
	isPrivate: z.boolean().optional(),
});

const AddMemberSchema = z.object({
	roomId: z.string().cuid(),
	userId: z.string().cuid(),
});

export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomInput = z.infer<typeof UpdateRoomSchema>;
export type AddMemberInput = z.infer<typeof AddMemberSchema>;

// Service-level error types
export class RoomServiceError extends Error {
	constructor(
		message: string,
		public code: string,
	) {
		super(message);
		this.name = "RoomServiceError";
	}
}

export class RoomNotFoundError extends RoomServiceError {
	constructor(roomId: string) {
		super(`Room ${roomId} not found`, "ROOM_NOT_FOUND");
	}
}

export class RoomFullError extends RoomServiceError {
	constructor(roomId: string) {
		super(`Room ${roomId} is full`, "ROOM_FULL");
	}
}

export class UserAlreadyInRoomError extends RoomServiceError {
	constructor(userId: string, roomId: string) {
		super(
			`User ${userId} is already in room ${roomId}`,
			"USER_ALREADY_IN_ROOM",
		);
	}
}

export class NotRoomOwnerError extends RoomServiceError {
	constructor(userId: string, roomId: string) {
		super(
			`User ${userId} is not the owner of room ${roomId}`,
			"NOT_ROOM_OWNER",
		);
	}
}

export class RoomService {
	constructor(
		private roomRepository: RoomRepository = new RoomRepository(),
		_userRepository: UserRepository = new UserRepository(),
	) {}

	async createRoom(input: CreateRoomInput): Promise<Room> {
		const validationResult = CreateRoomSchema.safeParse(input);
		if (!validationResult.success) {
			throw new RoomServiceError("Invalid input", "INVALID_INPUT");
		}

		// TODO: Check user plan for max capacity
		const roomData: RoomCreate = {
			...input,
			currentMediaId: null,
		};

		const room = await this.roomRepository.createRoom(roomData);

		// Add owner as the first member
		await this.roomRepository.addMemberToRoom({
				roomId: room.id,
				userId: room.ownerId,
			});

		return room;
	}

	async getRoom(roomId: string): Promise<RoomPublic | null> {
		return await this.roomRepository.findRoomById(roomId);
	}

	async updateRoom(
		roomId: string,
		userId: string,
		input: UpdateRoomInput,
	): Promise<Room> {
		const room = await this.roomRepository.findRoomById(roomId);
		if (!room) {
			throw new RoomNotFoundError(roomId);
		}

		if (room.ownerId !== userId) {
			throw new NotRoomOwnerError(userId, roomId);
		}

		return await this.roomRepository.updateRoom(roomId, input);
	}

	async deleteRoom(roomId: string, userId: string): Promise<void> {
		const room = await this.roomRepository.findRoomById(roomId);
		if (!room) {
			throw new RoomNotFoundError(roomId);
		}

		if (room.ownerId !== userId) {
			throw new NotRoomOwnerError(userId, roomId);
		}

		await this.roomRepository.deleteRoom(roomId);
	}

	async joinRoom(input: AddMemberInput): Promise<RoomMember> {
		const { roomId, userId } = input;
		const room = await this.roomRepository.findRoomById(roomId);
		if (!room) {
			throw new RoomNotFoundError(roomId);
		}

		const members = await this.roomRepository.findMembersByRoom(roomId);
		if (members.length >= room.maxCapacity) {
			throw new RoomFullError(roomId);
		}

		const isAlreadyMember = members.some((member) => member.userId === userId);
		if (isAlreadyMember) {
			throw new UserAlreadyInRoomError(userId, roomId);
		}

		return await this.roomRepository.addMemberToRoom({ roomId, userId, role: "VIEWER" });
	}

	async leaveRoom(roomId: string, userId: string): Promise<void> {
		const members = await this.roomRepository.findMembersByRoom(roomId);
		const member = members.find((m) => m.userId === userId);
		if (!member) {
			return; // User is not in the room
		}

		await this.roomRepository.removeMemberFromRoom(member.id);
	}

	async getRoomMembers(roomId: string): Promise<RoomMemberPublic[]> {
		return await this.roomRepository.findMembersByRoom(roomId);
	}

	async getPlaybackState(roomId: string): Promise<PlaybackState | null> {
		return await this.roomRepository.getPlaybackState(roomId);
	}

	async updatePlaybackState(
		roomId: string,
		userId: string,
		input: PlaybackStateUpdate,
	): Promise<PlaybackState> {
		const room = await this.roomRepository.findRoomById(roomId);
		if (!room) {
			throw new RoomNotFoundError(roomId);
		}

		// TODO: Check if user is host or has permission

		const state: PlaybackStateUpdate = {
			...input,
			lastUpdatedBy: userId,
		};

		return await this.roomRepository.updatePlaybackState(roomId, state);
	}
}
