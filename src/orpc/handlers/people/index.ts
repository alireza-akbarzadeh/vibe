import { base } from "@/orpc/router/base";
import { bulkCreatePeople, createPeople } from "./create";
import { bulkDeletePeople, deletePeople } from "./delete";
import { getPeople, getPeopleByPersonId, listPeople } from "./get";
import { updatePeople } from "./update";

/**
 * People Router - CRUD operations for cast/crew data
 */
export const PeopleRouter = base.router({
	list: listPeople,
	find: getPeople,
	findByPersonId: getPeopleByPersonId,
	create: createPeople,
	bulkCreate: bulkCreatePeople,
	update: updatePeople,
	delete: deletePeople,
	bulkDelete: bulkDeletePeople,
});
