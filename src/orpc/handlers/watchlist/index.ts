import { os } from "@/orpc/server";
import { addToWatchList } from "./create";
import { removeFromWatchList } from "./delete";
import { checkWatchList, listWatchList } from "./get";
import { toggleWatchList } from "./toggle";

export const watchListProcedures = os.router({
	add: addToWatchList,
	list: listWatchList,
	check: checkWatchList,
	remove: removeFromWatchList,
	toggle: toggleWatchList,
});
