import { os } from "@/orpc/root";
import { clearHistory, deleteHistoryItem } from "./delete";
import { getContinueWatching, getViewingHistory } from "./get";
import { updateProgress } from "./update";

export const ViewingHistoryRouter = os.router({
	update: updateProgress,
	get: getViewingHistory,
	continueWatching: getContinueWatching,
	deleteItem: deleteHistoryItem,
	clear: clearHistory,
});
