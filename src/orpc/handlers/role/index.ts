import { os } from "@orpc/server";

import { createRole } from "./create";
import { removeRole, removeRoleFromUser } from "./delete";
import { listRoles } from "./get";
import { assignRoleToUser, updateRole } from "./update";

export const roleRouter = os.router({
	list: listRoles,
	create: createRole,
	update: updateRole,
	removeRole: removeRole,
	assignRole: assignRoleToUser,
	removeRoleFromUser: removeRoleFromUser,
});
