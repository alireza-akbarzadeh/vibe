import { os } from "@/orpc/server";
import { createCreator } from "./create";
import { deleteCreator } from "./delete";
import { getCreator, listCreators } from "./get";
import { updateCreator } from "./update";

export const creatorProcedures = os.router({
	create: createCreator,
	delete: deleteCreator,
	get: getCreator,
	list: listCreators,
	update: updateCreator,
});
