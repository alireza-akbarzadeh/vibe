import { base } from "@/orpc/router/base";
import { getLibraryDashboard } from "./dashboard";

export const LibraryRouter = base.router({
	dashboard: getLibraryDashboard,
});
