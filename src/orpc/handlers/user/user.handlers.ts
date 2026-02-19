import { z } from "zod";
import { authedProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { RoomPublicOutputSchema } from "@/orpc/types/streaming/room.output";
import { UserPrivateSchema } from "@/orpc/types/user.output";
import { UserNotFoundError, UserService } from "@/server/services/user.service";

// Initialize service
const userService = new UserService();

// Get current user procedure
export const getCurrentUser = authedProcedure
	.input(z.void())
	.output(ResponseSchema.ApiResponseSchema(UserPrivateSchema))
	.handler(async ({ ctx }) => {
		try {
			const user = await userService.getPrivateUserData(ctx.user.id);
			return {
				status: 200,
				message: "User data retrieved successfully",
				data: user,
			};
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				return {
					status: 404,
					message: "User not found",
					data: null,
				};
			}

			console.error("Unexpected error in getCurrentUser:", error);
			return {
				status: 500,
				message: "An unexpected error occurred",
				data: null,
			};
		}
	});

// Get user rooms procedure
export const getUserRooms = authedProcedure
	.input(z.void())
	.output(ResponseSchema.ApiResponseSchema(z.array(RoomPublicOutputSchema)))
	.handler(async ({ ctx }) => {
		try {
			const rooms = await userService.getUserRooms(ctx.user.id);
			return {
				status: 200,
				message: "User rooms retrieved successfully",
				data: rooms,
			};
		} catch (error) {
			console.error("Unexpected error in getUserRooms:", error);
			return {
				status: 500,
				message: "An unexpected error occurred",
				data: [],
			};
		}
	});

// Export all user procedures
export const userProcedures = {
	getCurrentUser,
	getUserRooms,
};
