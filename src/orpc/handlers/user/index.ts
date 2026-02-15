import { os } from "@orpc/server";
import { getUserAccess } from "./get-user-access";
import { listUsersWithAccess } from "./get-users-with-access";
import { assignUserPermission, removeUserPermission } from "./user-permissions";

export const userRouter = os.router({
	getUserAccess,
	listUsersWithAccess,
	assignUserPermission,
	removeUserPermission,
});

