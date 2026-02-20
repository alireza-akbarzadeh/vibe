import { os } from "@/orpc/server";
import { bulkCreate, create } from "./create";
import { bulkDelete, remove } from "./delete";
import { find, findByTmdbId, list } from "./get";
import { update } from "./update";

/**
 * Person Router - Complete CRUD for TMDB person data
 *
 * Endpoints:
 * - create: Create a single person with known_for movies
 * - bulkCreate: Bulk import persons from TMDB API
 * - find: Get person by ID with their known works
 * - list: List persons with pagination/search
 * - findByTmdbId: Find person by TMDB ID
 * - update: Update person information
 * - delete: Delete person
 * - bulkDelete: Delete multiple persons
 */
export const PersonRouter = os.router({
	create,
	bulkCreate,
	find,
	list,
	findByTmdbId,
	update,
	delete: remove,
	bulkDelete,
});
