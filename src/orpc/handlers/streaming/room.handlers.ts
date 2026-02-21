import { z } from "zod";
import { publicProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { os } from "@/orpc/root";
import { RoomPublicOutputSchema } from "@/orpc/types/streaming/room.output";
import { CreateRoomInputSchema } from "@/orpc/types/streaming/room.types";
import { ChatService } from "@/server/services/chat.service";
import {
	RoomFullError,
	RoomNotFoundError,
	RoomService,
	RoomServiceError,
} from "@/server/services/room.service";

// Initialize services
const roomService = new RoomService();
const chatService = new ChatService();

// Room creation procedure
export const createRoom = publicProcedure
	.input(CreateRoomInputSchema)
	.output(ResponseSchema.ApiResponseSchema(RoomPublicOutputSchema))
	.handler(async ({ input, errors }) => {
		try {
			const room = await roomService.createRoom(input);
			return {
				status: 201,
				message: "Room created successfully",
				data: room,
			};
		} catch (error) {
			if (error instanceof RoomServiceError) {
				throw errors.BAD_REQUEST({ message: error.message });
			}

			throw errors.INTERNAL_SERVER_ERROR({
				message: "An unexpected error occurred",
			});
		}
	});

// Get room details procedure
export const getRoom = publicProcedure
	.input(z.object({ roomId: z.string().cuid() }))
	.output(ResponseSchema.ApiResponseSchema(RoomPublicOutputSchema))
	.handler(async ({ input, errors }) => {
		try {
			const room = await roomService.getRoom(input.roomId);
			if (!room) {
				throw errors.NOT_FOUND({ message: "Room not found" });
			}

			return {
				status: 200,
				message: "Room retrieved successfully",
				data: room,
			};
		} catch (error) {
			if (error instanceof RoomServiceError) {
				throw errors.BAD_REQUEST({ message: error.message });
			}

			throw errors.INTERNAL_SERVER_ERROR({
				message: "An unexpected error occurred",
			});
		}
	});

// Join room procedure
export const joinRoom = publicProcedure
	.input(
		z.object({
			roomId: z.string().cuid(),
			userId: z.string().cuid(),
		}),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({
				memberId: z.string(),
				roomId: z.string(),
				userId: z.string(),
				joinedAt: z.date(),
			}),
		),
	)
	.handler(async ({ input, errors }) => {
		try {
			const member = await roomService.joinRoom(input);
			return {
				status: 200,
				message: "Successfully joined room",
				data: member,
			};
		} catch (error) {
			if (error instanceof RoomNotFoundError) {
				throw errors.NOT_FOUND({ message: error.message });
			}
			if (error instanceof RoomFullError) {
				throw errors.BAD_REQUEST({ message: error.message });
			}

			throw errors.INTERNAL_SERVER_ERROR({
				message: "An unexpected error occurred",
			});
		}
	});

// Get room messages procedure
export const getRoomMessages = publicProcedure
	.input(
		z.object({
			roomId: z.string().cuid(),
			limit: z.number().int().min(1).max(100).optional().default(50),
			cursor: z.string().cuid().optional(),
		}),
	)
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({
				messages: z.array(
					z.object({
						id: z.string(),
						roomId: z.string(),
						userId: z.string(),
						profileId: z.string().nullable(),
						content: z.string(),
						type: z.enum(["TEXT", "EMOJI", "SYSTEM", "REACTION"]),
						parentId: z.string().nullable(),
						isEdited: z.boolean(),
						editedAt: z.date().nullable(),
						isDeleted: z.boolean(),
						deletedAt: z.date().nullable(),
						reactions: z.record(z.string(), z.number()),
						createdAt: z.date(),
						updatedAt: z.date(),
					}),
				),
				hasMore: z.boolean(),
				cursor: z.string().optional(),
			}),
		),
	)
	.handler(async ({ input }) => {
		try {
			const result = await chatService.getRoomMessages(input.roomId, {
				limit: input.limit,
				cursor: input.cursor,
			});

			return {
				status: 200,
				message: "Messages retrieved successfully",
				data: result,
			};
		} catch (error) {
			console.error("Unexpected error in getRoomMessages:", error);
			return {
				status: 500,
				message: "An unexpected error occurred",
				data: { messages: [], hasMore: false },
			};
		}
	});

// Export all room procedures
export const RoomRouter = os.router({
	createRoom,
	getRoom,
	joinRoom,
	getRoomMessages,
});
