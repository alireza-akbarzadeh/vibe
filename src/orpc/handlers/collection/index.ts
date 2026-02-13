import { os } from "@orpc/server";
import {
	createCollection,
	deleteCollection,
	listCollections,
	updateCollection,
} from "./protected";

export const CollectionRouter = os.router({
	list: listCollections,
	create: createCollection,
	update: updateCollection,
	delete: deleteCollection,
});
