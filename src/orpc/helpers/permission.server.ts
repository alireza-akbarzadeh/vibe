import { db } from "@/lib/db.server";

export async function userHasPermission(
	userId: string,
	resource: string,
	action: string,
): Promise<boolean> {
	const user = await db.client.user.findUnique({
		where: { id: userId },
		include: {
			roles: {
				include: {
					role: {
						include: {
							permissions: {
								include: {
									permission: true,
								},
							},
						},
					},
				},
			},
		},
	});

	if (!user) {
		return false;
	}

	for (const userRole of user.roles) {
		for (const rolePermission of userRole.role.permissions) {
			if (
				rolePermission.permission.resource === resource &&
				rolePermission.permission.action === action
			) {
				return true;
			}
		}
	}

	return false;
}
