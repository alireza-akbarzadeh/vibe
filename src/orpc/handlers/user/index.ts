import { os } from "@orpc/server";
import { getUserAccess } from "./get-user-access";
import { listUsersWithAccess } from "./get-users-with-access";
import { listUsers } from "./list-users";
import { listAuditLogs } from "./list-audit-logs";
import { assignUserPermission, removeUserPermission } from "./user-permissions";

export const userRouter = os.router({
	listUsers,
	listAuditLogs,
	getUserAccess,
	listUsersWithAccess,
	assignUserPermission,
	removeUserPermission,
});

