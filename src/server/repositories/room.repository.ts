import type {
	PlaybackState,
	PlaybackStateCreate,
	PlaybackStateUpdate,
	Room,
	RoomCreate,
	RoomMember,
	RoomMemberCreate,
	RoomMemberPublic,
	RoomMemberUpdate,
	RoomPublic,
	RoomUpdate,
} from "@/orpc/models/streaming";
import { db } from "@/lib/db.server";

export class RoomRepository {
	// Room methods
	async findRoomById(id: string): Promise<RoomPublic | null> {
		return (await db.client.room.findUnique({
			where: { id },
		})) as RoomPublic | null;
	}

	async findRoomByToken(token: string): Promise<Room | null> {
		return (await db.client.room.findUnique({
			where: { token },
		})) as Room | null;
	}

	async createRoom(data: RoomCreate): Promise<Room> {
		return await db.client.room.create({
			data: { ...data, token: crypto.randomUUID() },
		});
	}

	async updateRoom(id: string, data: RoomUpdate): Promise<Room> {
		return await db.client.room.update({
			where: { id },
			data,
		});
	}

	async deleteRoom(id: string): Promise<Room> {
		return await db.client.room.delete({ where: { id } });
	}

	// Room Member methods
	async findMemberById(id: string): Promise<RoomMemberPublic | null> {
		return (await db.client.roomMember.findUnique({
			where: { id },
		})) as RoomMemberPublic | null;
	}

	async findMembersByRoom(roomId: string): Promise<RoomMemberPublic[]> {
		return (await db.client.roomMember.findMany({
			where: { roomId },
		})) as RoomMemberPublic[];
	}

	async addMemberToRoom(data: RoomMemberCreate): Promise<RoomMember> {
		return (await db.client.roomMember.create({
			data,
		})) as RoomMember;
	}

	async removeMemberFromRoom(id: string): Promise<RoomMember> {
		return (await db.client.roomMember.delete({
			where: { id },
		})) as RoomMember;
	}

	async updateMember(id: string, data: RoomMemberUpdate): Promise<RoomMember> {
		return (await db.client.roomMember.update({
			where: { id },
			data,
		})) as RoomMember;
	}

	// Playback State methods
	async getPlaybackState(roomId: string): Promise<PlaybackState | null> {
		return (await db.client.playbackState.findUnique({
			where: { roomId },
		})) as PlaybackState | null;
	}

	async createPlaybackState(data: PlaybackStateCreate): Promise<PlaybackState> {
		return (await db.client.playbackState.create({
			data,
		})) as PlaybackState;
	}

	async updatePlaybackState(
		roomId: string,
		data: PlaybackStateUpdate,
	): Promise<PlaybackState> {
		return (await db.client.playbackState.update({
			where: { roomId },
			data,
		})) as PlaybackState;
	}
}
