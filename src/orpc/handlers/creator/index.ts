import { base } from "@/orpc/router/base";
import { bulkCreateCreator, createCreator } from "./create";
import { deleteCreator } from "./delete";
import { getCreator, listCreators } from "./get";
import { updateCreator } from "./update";

export const CreatorRouter = base.router({
	create: createCreator,
	bulkCreate: bulkCreateCreator,
	get: getCreator,
	list: listCreators,
	update: updateCreator,
	delete: deleteCreator,
});
