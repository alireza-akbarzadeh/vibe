import { db } from "@/server/db";
import type { Message, MessageCreate } from "@/orpc/models/streaming";

export class ChatRepository {
	async findMessagesByRoom(
		roomId: string,
		limit: number,
		cursor?: string,
	): Promise<Message[]> {
		return db.message.findMany({
			where: { roomId },
			take: limit,
			cursor: cursor ? { id: cursor } : undefined,
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async createMessage(data: MessageCreate): Promise<Message> {
		return db.message.create({ data });
	}
}
