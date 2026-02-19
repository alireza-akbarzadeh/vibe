import { os } from "@/orpc/server";
import { clearHistory, deleteHistoryItem } from "./delete";
import { getContinueWatching, getViewingHistory } from "./get";
import { updateProgress } from "./update";

export const viewingHistoryProcedures = os.router({
	update: updateProgress,
	get: getViewingHistory,
	continueWatching: getContinueWatching,
	deleteItem: deleteHistoryItem,
	clear: clearHistory,
});
