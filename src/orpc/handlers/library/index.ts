import { os } from "@/orpc/root";
import { getLibraryDashboard } from "./dashboard";

export const LibraryRouter = os.router({
	dashboard: getLibraryDashboard,
});
