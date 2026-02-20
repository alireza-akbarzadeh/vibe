import { os } from "@/orpc/root";
import { bulkCreateCollection, createCollection } from "./create";
import { deleteCollection } from "./delete";
import { listCollections } from "./get";
import { updateCollection } from "./update";

export const CollectionRouter = os.router({
	list: listCollections,
	create: createCollection,
	bulkCreate: bulkCreateCollection,
	update: updateCollection,
	delete: deleteCollection,
});
