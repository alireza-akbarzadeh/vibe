import { os } from "@orpc/server";
import * as z from "zod";
import { prisma } from "@/lib/db";

export const listTodos = os.input(z.object({})).handler(async () => {
	return prisma.todo.findMany({ orderBy: { id: "asc" } });
});

export const addTodo = os
	.input(z.object({ title: z.string().min(1) }))
	.handler(async ({ input }) => {
		return prisma.todo.create({
			data: { title: input.title },
		});
	});
