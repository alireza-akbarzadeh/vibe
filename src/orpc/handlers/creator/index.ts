import { os } from "@/orpc/root";
import { createCreator } from "./create";
import { deleteCreator } from "./delete";
import { getCreator, listCreators } from "./get";
import { updateCreator } from "./update";

export const CreatorRouter = os.router({
	create: createCreator,
	delete: deleteCreator,
	get: getCreator,
	list: listCreators,
	update: updateCreator,
});
