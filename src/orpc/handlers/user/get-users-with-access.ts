import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import {
	ListUsersWithAccessOutput,
	listUsersWithAccessInput,
} from "@/orpc/models/user-access";

export const listUsersWithAccess = adminProcedure
	.input(listUsersWithAccessInput)
	.output(ListUsersWithAccessOutput)
	.handler(async ({ input }) => {
		const { search, roleId, page, limit } = input;
		const skip = (page - 1) * limit;

		const where: Prisma.UserWhereInput = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
			];
		}

		if (roleId) {
			where.roles = {
				some: {
					roleId,
				},
			};
		}

		// Get total count
		const total = await prisma.user.count({ where });

		// Get users with roles and permissions
		const users = await prisma.user.findMany({
			where,
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
			include: {
				roles: {
					include: {
						role: {
							select: {
								id: true,
								name: true,
								description: true,
								permissions: {
									include: {
										permission: true,
									},
								},
							},
						},
					},
				},
				permissions: {
					include: {
						permission: {
							select: {
								id: true,
								name: true,
								description: true,
								resource: true,
								action: true,
							},
						},
					},
				},
			},
		});

		// Transform data to match output schema
		const transformedUsers = users.map((user) => {
			// Get direct permissions
			const directPermissions = user.permissions.map((up) => ({
				id: up.permission.id,
				name: up.permission.name,
				description: up.permission.description,
				resource: up.permission.resource,
				action: up.permission.action,
				isDirect: true,
				expiresAt: up.expiresAt?.toISOString() ?? null,
				grantedBy: up.grantedBy,
			}));

			// Get permissions from roles (deduplicate by permission ID)
			const permissionMap = new Map();

			// Add direct permissions first
			for (const perm of directPermissions) {
				permissionMap.set(perm.id, perm);
			}

			// Add role permissions (if not already direct)
			for (const userRole of user.roles) {
				for (const rolePerm of userRole.role.permissions) {
					if (!permissionMap.has(rolePerm.permission.id)) {
						permissionMap.set(rolePerm.permission.id, {
							id: rolePerm.permission.id,
							name: rolePerm.permission.name,
							description: rolePerm.permission.description,
							resource: rolePerm.permission.resource,
							action: rolePerm.permission.action,
							isDirect: false,
							expiresAt: null,
							grantedBy: null,
						});
					}
				}
			}

			// Get roles
			const roles = user.roles.map((ur) => ({
				id: ur.role.id,
				name: ur.role.name,
				description: ur.role.description,
				assignedAt: ur.assignedAt.toISOString(),
				assignedBy: ur.assignedBy,
			}));

			return {
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image,
				roles,
				permissions: Array.from(permissionMap.values()),
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
				banned: user.banned,
			};
		});

		return {
			users: transformedUsers,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	});
