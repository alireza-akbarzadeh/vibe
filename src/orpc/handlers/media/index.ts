import { base } from "@/orpc/router/base";
import { bulkCreateMedia, createMedia } from "./create";
import { deleteMedia } from "./delete";
import { getMedia, getTrendingSearches, listMedia } from "./get";
import { searchMedia } from "./search";
import { updateMedia } from "./update";

export const MediaRouter = base.router({
	list: listMedia,
	find: getMedia,
	search: searchMedia,
	trendingSearches: getTrendingSearches,
	create: createMedia,
	bulkCreate: bulkCreateMedia,
	update: updateMedia,
	delete: deleteMedia,
});
