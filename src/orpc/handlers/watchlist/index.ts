import { base } from "@/orpc/router/base";
import { addToWatchList } from "./create";
import { removeFromWatchList } from "./delete";
import { checkWatchList, listWatchList } from "./get";

export const WatchListRouter = base.router({
	add: addToWatchList,
	list: listWatchList,
	check: checkWatchList,
	remove: removeFromWatchList,
});
