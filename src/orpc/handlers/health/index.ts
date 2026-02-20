import { os } from "@/orpc/root";
import { getPlatformStats } from "./health.handlers";

export const HealthRouter = os.router({
	platformStats: getPlatformStats,
});
