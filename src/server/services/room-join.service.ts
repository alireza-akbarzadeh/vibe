import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/server/db";
import type { RoomMember } from "@/orpc/models/streaming";

// Input schema for atomic room join
export const AtomicJoinRoomInputSchema = z.object({
	roomId: z.string().cuid(),
	userId: z.string().cuid(),
	planMaxCapacity: z.number().int().min(1),
});

export type AtomicJoinRoomInput = z.infer<typeof AtomicJoinRoomInputSchema>;



// Error types for room join operations
export class RoomJoinError extends Error {
	constructor(
		message: string,
		public code: string,
	) {
		super(message);
		this.name = "RoomJoinError";
	}
}

export class RoomFullError extends RoomJoinError {
	constructor() {
		super("Room has reached maximum capacity", "ROOM_FULL");
		this.name = "RoomFullError";
	}
}

export class UserAlreadyInRoomError extends RoomJoinError {
	constructor() {
		super("User is already a member of this room", "USER_ALREADY_IN_ROOM");
		this.name = "UserAlreadyInRoomError";
	}
}

export class RoomNotFoundError extends RoomJoinError {
	constructor() {
		super("Room not found", "ROOM_NOT_FOUND");
		this.name = "RoomNotFoundError";
	}
}

/**
 * Atomic room join operation with capacity enforcement
 * This prevents race conditions when multiple users try to join simultaneously
 */
export async function atomicJoinRoom(input: AtomicJoinRoomInput): Promise<{
	success: boolean;
	member?: RoomMember;
	error?: RoomJoinError;
}> {
	return await db.transaction(
		async (tx) => {
			// Step 1: Check if room exists and get current capacity
			const room = await tx.room.findUnique({
				where: { id: input.roomId },
				select: {
					id: true,
					isPrivate: true,
					maxCapacity: true,
					ownerId: true,
					_count: {
						select: { members: true },
					},
				},
			});

			if (!room) {
				return { success: false, error: new RoomNotFoundError() };
			}

			// Step 2: Check if user is already in the room (idempotent)
			const existingMember = await tx.roomMember.findUnique({
				where: {
					roomId_userId: {
						roomId: input.roomId,
						userId: input.userId,
					},
				},
			});

			if (existingMember) {
				return { success: false, error: new UserAlreadyInRoomError() };
			}

			// Step 3: Calculate actual capacity (respecting plan limits)
			const currentMemberCount = room._count.members;
			const effectiveMaxCapacity = Math.min(
				room.maxCapacity,
				input.planMaxCapacity,
			);

			// Step 4: Check capacity constraints
			if (currentMemberCount >= effectiveMaxCapacity) {
				return { success: false, error: new RoomFullError() };
			}

			// Step 5: Create room member with proper role assignment
			const member = await tx.roomMember.create({
				data: {
					roomId: input.roomId,
					userId: input.userId,
				},
				include: { user: true },
			});

				// Step 6: Update room activity (optional, but good for UX)
				await tx.room.update({
					where: { id: input.roomId },
					data: {
						updatedAt: new Date(),
					},
				});

				return { success: true, member: { ...member, joinedAt: member.createdAt } };
		},
		{
			isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
		},
	);
}

/**
 * Batch atomic room joins for multiple users
 * Useful for invite operations or bulk joins
 */
export async function atomicBatchJoinRoom(
	inputs: AtomicJoinRoomInput[],
): Promise<{
	successful: Array<{ input: AtomicJoinRoomInput; member: RoomMember }>;
	failed: Array<{ input: AtomicJoinRoomInput; error: RoomJoinError }>;
}> {
	const results = await Promise.allSettled(
		inputs.map((input) => atomicJoinRoom(input)),
	);

	const successful: Array<{ input: AtomicJoinRoomInput; member: RoomMember }> =
		[];
	const failed: Array<{ input: AtomicJoinRoomInput; error: RoomJoinError }> =
		[];

	for (const [index, result] of results.entries()) {
		const input = inputs[index];
		if (!input) continue;

		if (result.status === "fulfilled" && result.value.success) {
			if (result.value.member) {
				successful.push({
					input,
					member: result.value.member,
				});
			}
		} else if (result.status === "fulfilled") {
			if (result.value.error) {
				failed.push({
					input,
					error: result.value.error,
				});
			}
		} else {
			failed.push({
				input,
				error: new RoomJoinError(
					"Unexpected error during join",
					"UNEXPECTED_ERROR",
				),
			});
		}
	}

	return { successful, failed };
}
