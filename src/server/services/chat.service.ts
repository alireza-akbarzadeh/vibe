import { z } from "zod";
import { ChatRepository } from "@/server/repositories/chat.repository";

const GetRoomMessagesSchema = z.object({
	roomId: z.string().cuid(),
	limit: z.number().int().min(1).max(100).optional().default(50),
	cursor: z.string().cuid().optional(),
});

export class ChatService {
	constructor(private chatRepository: ChatRepository = new ChatRepository()) {}

	async getRoomMessages(
		roomId: string,
		options: { limit?: number; cursor?: string },
	) {
		const validationResult = GetRoomMessagesSchema.safeParse({
			roomId,
			...options,
		});
		if (!validationResult.success) {
			throw new Error("Invalid input");
		}

		const { limit, cursor } = validationResult.data;
		const messages = await this.chatRepository.findMessagesByRoom(
			roomId,
			limit + 1, // Fetch one extra to determine if there are more
			cursor,
		);

		const hasMore = messages.length > limit;
		const nextCursor = hasMore ? messages.pop()!.id : undefined;

		return {
			messages,
			hasMore,
			cursor: nextCursor,
		};
	}

	// Additional methods like createMessage would go here
}
