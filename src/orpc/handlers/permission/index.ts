import { os } from "@/orpc/root";
import { createPermission } from "./create";
import { deletePermission } from "./delete";
import { getPermission, listPermissions } from "./get";
import { updatePermission } from "./update";

export const PermissionRouter = os.router({
	create: createPermission,
	get: getPermission,
	list: listPermissions,
	update: updatePermission,
	delete: deletePermission,
});
