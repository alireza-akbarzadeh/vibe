import { z } from "zod";

// Checkout input schema for plan selection
export const CheckoutInput = z.object({
	productId: z.string().optional(),
	slug: z.string().optional(),
	referenceId: z.string().optional(),
	redirectUrl: z.string().optional(),
});

export type CheckoutInputScheme = z.infer<typeof CheckoutInput>;
