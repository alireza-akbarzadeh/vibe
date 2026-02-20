import { db } from "@/server/db";
import type { ChatMessageCreate } from "@/orpc/models/streaming";

export class ChatRepository {
	async findMessagesByRoom(
		roomId: string,
		limit: number,
		cursor?: string,
	) {
		return db.client.message.findMany({
			where: { roomId },
			take: limit,
			cursor: cursor ? { id: cursor } : undefined,
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async createMessage(data: ChatMessageCreate) {
		return db.client.message.create({ data });
	}
}
