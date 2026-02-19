import { os } from "@/orpc/server";
import { createPermission } from "./create";
import { deletePermission } from "./delete";
import { getPermission, listPermissions } from "./get";
import { updatePermission } from "./update";

export const permissionProcedures = os.router({
	create: createPermission,
	get: getPermission,
	list: listPermissions,
	update: updatePermission,
	delete: deletePermission,
});
