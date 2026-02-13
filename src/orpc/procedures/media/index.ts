import { os } from "@orpc/server";
import { createMedia, deleteMedia, updateMedia } from "./protected";
import { getMedia, listMedia } from "./public";

export const MediaRouter = os.router({
	list: listMedia,
	find: getMedia,
	create: createMedia,
	update: updateMedia,
	delete: deleteMedia,
});
