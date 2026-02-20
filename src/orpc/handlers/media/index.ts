import { os } from "@/orpc/root";
import { bulkCreateMedia, createMedia } from "./create";
import { deleteMedia } from "./delete";
import { getMedia, getTrendingSearches, listMedia } from "./get";
import { searchMedia } from "./search";
import { updateMedia } from "./update";

export const MediaRouter = os.router({
	list: listMedia,
	find: getMedia,
	search: searchMedia,
	trendingSearches: getTrendingSearches,
	create: createMedia,
	bulkCreate: bulkCreateMedia,
	update: updateMedia,
	delete: deleteMedia,
});
