import { z } from "zod";

export const PaginationInputSchema = z.object({
	limit: z.number().min(1).max(100).default(20),
	cursor: z.string().cuid().optional(), // cuid is a good choice for cursor
});

export const PaginatedOutput = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		items: z.array(itemSchema),
		nextCursor: z.string().cuid().optional(),
	});

/* -------------------------------------------------------------------------- */
/*                              Standard API Response                          */
/* -------------------------------------------------------------------------- */

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		status: z.number(),
		message: z.string(),
		data: dataSchema,
	});
