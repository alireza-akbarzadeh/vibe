import { os } from "@orpc/server";
import {
	assignRoleToUser,
	createRole,
	deleteRole,
	listRoles,
	removeRoleFromUser,
	updateRole,
} from "./protected";

export const roleRouter = os.router({
	list: listRoles,
	create: createRole,
	update: updateRole,
	removeRole: deleteRole,
	assignRole: assignRoleToUser,
	removeAssignedRole: removeRoleFromUser,
});
