import z from "zod";

export const userAccountSchema = z.object({
	// Identity
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Invalid email"),
	avatar: z.string().url("Invalid avatar URL").optional(),
	organization: z.string().optional(),

	// Status & Access
	role: z.enum(["Admin", "Moderator", "User"]),
	status: z.enum(["active", "pending", "suspended", "flagged", "deactivated"]),
	plan: z.enum(["Free", "Standard", "Premium"]),

	// Profile & Locale
	city: z.string().optional(),
	country: z.string().optional(),
	timezone: z.string().optional(),
	locale: z.string().optional(),

	// Billing
	billingStatus: z.enum(["active", "past_due", "cancelled", "trialing"]),
	accountBalance: z.number().min(0),
	credits: z.number().int().min(0),

	// Metadata
	tags: z.array(z.string()).default([]),
	notes: z.string().optional(),
});

export type UserAccountFormData = z.infer<typeof userAccountSchema>;
