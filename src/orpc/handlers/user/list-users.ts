import { z } from "zod";
import { prisma } from "@/lib/db";
import { authedProcedure } from "@/orpc/context";

const ListUsersInputSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(50),
	search: z.string().optional(),
	role: z.enum(["ADMIN", "MODERATOR", "USER"]).optional(),
	subscriptionStatus: z
		.enum(["FREE", "PRO", "PREMIUM", "CANCELLED"])
		.optional(),
});

const UserResponseSchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	email: z.string(),
	image: z.string().nullable(),
	role: z.string(),
	emailVerified: z.boolean(),
	twoFactorEnabled: z.boolean(),
	subscriptionStatus: z.string(),
	currentPlan: z.string().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	banned: z.boolean(),
	agreeToTerms: z.boolean(),
});

export const listUsers = authedProcedure
	.input(ListUsersInputSchema)
	.output(
		z.object({
			users: z.array(UserResponseSchema),
			total: z.number(),
			page: z.number(),
			limit: z.number(),
			totalPages: z.number(),
		}),
	)
	.handler(async ({ input }) => {
		const { page, limit, search, role, subscriptionStatus } = input;
		const skip = (page - 1) * limit;

		// Build where clause
		const where: any = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
			];
		}

		if (role) {
			where.role = role;
		}

		if (subscriptionStatus) {
			where.subscriptionStatus = subscriptionStatus;
		}

		// Get total count
		const total = await prisma.user.count({ where });

		// Get users
		const users = await prisma.user.findMany({
			where,
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				role: true,
				emailVerified: true,
				twoFactorEnabled: true,
				subscriptionStatus: true,
				currentPlan: true,
				createdAt: true,
				updatedAt: true,
				banned: true,
				agreeToTerms: true,
			},
		});

		const totalPages = Math.ceil(total / limit);

		return {
			users: users.map(user => ({
				...user,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
			})),
			total,
			page,
			limit,
			totalPages,
		};
	});
