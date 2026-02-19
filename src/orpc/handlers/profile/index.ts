import { os } from "@/orpc/server";
import { createProfile } from "./create";
import { deleteProfile } from "./delete";
import { getProfile, listProfiles } from "./get";
import { updateProfile } from "./update";

export const profileProcedures = os.router({
	create: createProfile,
	get: getProfile,
	list: listProfiles,
	update: updateProfile,
	delete: deleteProfile,
});
