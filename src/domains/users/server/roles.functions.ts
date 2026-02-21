import { orpc } from "@/orpc/client";
import type { StaffMember } from "../containers/role-management-page";

/**
 * Fetch users with their roles and permissions
 */
export async function getStaffWithAccess(
	search?: string,
): Promise<StaffMember[]> {
	try {
		const response = await client.users.listUsersWithAccess({
			page: 1,
			limit: 100,
			search,
		});

		return response.users.map((user) => {
			// Get primary role
			const primaryRole = user.roles[0]?.name || "User";

			// Map permissions to activePerms format
			const activePerms: { [key: string]: "read" | "write" | null } = {};
			user.permissions.forEach((perm) => {
				const action = perm.action.toLowerCase();
				if (action.includes("read") || action.includes("view")) {
					activePerms[perm.resource] = "read";
				} else if (action.includes("write") || action.includes("edit")) {
					activePerms[perm.resource] = "write";
				}
			});

			// Determine status based on user properties
			let status: "online" | "offline" | "flagged" = "offline";
			if (user?.banned) {
				status = "flagged";
			}

			return {
				id: user.id,
				name: user.name || "Unknown",
				email: user.email,
				phone: "N/A",
				role: primaryRole,
				status,
				lastActive: new Date(user.updatedAt).toLocaleString(),
				ipAddress: "N/A",
				activePerms,
			};
		});
	} catch (error) {
		console.error("Failed to fetch staff with access:", error);
		throw new Error("Failed to fetch staff members");
	}
}
