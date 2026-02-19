import { os } from "@/orpc/server";
import { getPlatformStats } from "./health.handlers";

export const healthProcedures = os.router({
	platformStats: getPlatformStats,
});
