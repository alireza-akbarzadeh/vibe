import { prisma } from "@/lib/db.server";
import { adminProcedure } from "@/orpc/context";
import { UserAccessOutput, userIdInput } from "@/orpc/models/user-access";

export const getUserAccess = adminProcedure
	.input(userIdInput)
	.output(UserAccessOutput)
	.handler(async ({ input }) => {
		const { userId } = input;

		// Get user with roles and permissions
		const user = await prisma.user.findUnique({
			where: { id: userId },
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

		if (!user) {
			throw new Error("User not found");
		}

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
