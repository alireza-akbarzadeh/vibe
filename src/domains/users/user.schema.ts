import z from "zod";

export const userAccountSchema = z.object({
	// Core Identity
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Invalid work email"),
	role: z.enum(["Admin", "Moderator", "User"]),
	status: z.enum(["active", "pending", "suspended"]),

	// Security
	twoFactorEnabled: z.boolean().default(false),
	phone: z.string().optional(),

	// Regional
	country: z.string().min(1, "Country is required"),
	timezone: z.string().default("UTC"),
	locale: z.string().default("en-US"),

	// Billing & Plan
	plan: z.enum(["Free", "Standard", "Premium"]).default("Free"),
	billingStatus: z
		.enum(["active", "past_due", "cancelled", "trialing"])
		.default("active"),
	accountBalance: z.number().default(0),
	credits: z.number().min(0).default(0),

	// Admin & Org
	organization: z.string().optional(),
	manager: z.string().optional(),
	notes: z.string().max(500, "Notes are too long").optional(),
	tags: z.array(z.string()).default([]),
});

type UserAccount = z.infer<typeof userAccountSchema>;
