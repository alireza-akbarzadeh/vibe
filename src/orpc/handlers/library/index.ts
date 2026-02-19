import { os } from "@/orpc/server";
import { getLibraryDashboard } from "./dashboard";

export const libraryProcedures = os.router({
	dashboard: getLibraryDashboard,
});
