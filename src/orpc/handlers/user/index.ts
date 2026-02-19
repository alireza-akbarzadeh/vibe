
import { base } from "@/orpc/context";
import { getUserStats } from "./get-stats";
import { getUserAccess } from "./get-user-access";
import { listUsersWithAccess } from "./get-users-with-access";
import { listAuditLogs } from "./list-audit-logs";
import { listUsers } from "./list-users";
import { assignUserPermission, removeUserPermission } from "./user-permissions";

export const userRouter = base.router({
	listUsers,
	listAuditLogs,
	getUserAccess,
	listUsersWithAccess,
	assignUserPermission,
	removeUserPermission,
	getStats: getUserStats,
});
