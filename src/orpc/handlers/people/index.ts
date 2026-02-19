import { os } from "@/orpc/server";
import { bulkCreatePeople, createPeople } from "./create";
import { bulkDeletePeople, deletePeople } from "./delete";
import { getPeople, getPeopleByPersonId, listPeople } from "./get";
import { updatePeople } from "./update";

/**
 * People Router - CRUD operations for cast/crew data
 */
export const peopleProcedures = os.router({
	list: listPeople,
	find: getPeople,
	findByPersonId: getPeopleByPersonId,
	create: createPeople,
	bulkCreate: bulkCreatePeople,
	update: updatePeople,
	delete: deletePeople,
	bulkDelete: bulkDeletePeople,
});
