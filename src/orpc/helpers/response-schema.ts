import { z } from "zod";

export const PaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		items: z.array(itemSchema),
		pagination: z.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			pages: z.number(),
		}),
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
