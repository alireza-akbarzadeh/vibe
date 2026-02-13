import { os } from "@orpc/server";
import { deleteMedia } from "./delete";
import { getMedia, listMedia } from "./get";
import { createMedia, updateMedia } from "./update";

export const MediaRouter = os.router({
	list: listMedia,
	find: getMedia,
	create: createMedia,
	update: updateMedia,
	delete: deleteMedia,
});
