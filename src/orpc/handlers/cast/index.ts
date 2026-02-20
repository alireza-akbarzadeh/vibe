import { os } from "@/orpc/root";
import { bulkCreateCast, createCastMember } from "./cast-create";
import { deleteAllCast, deleteCastMember } from "./cast-delete";
import { getMediaCast, listCast } from "./cast-get";
import { updateCastMember } from "./cast-update";

/**
 * Cast & Crew Router
 *
 * Endpoints for managing cast and crew members (actors, directors, writers, etc.)
 *
 * **Create:**
 * - createCastMember: Add single cast member (admin)
 * - bulkCreateCast: Import multiple cast members (admin)
 *
 * **Read:**
 * - listCast: List with pagination and filters (public)
 * - getMediaCast: Get all cast grouped by type (public)
 *
 * **Update:**
 * - updateCastMember: Update cast member details (admin)
 *
 * **Delete:**
 * - deleteCastMember: Delete single cast member (admin)
 * - deleteAllCast: Delete all cast for a media (admin)
 */
export const CastRouter = os.router({
	// Create
	createCastMember,
	bulkCreateCast,

	// Read
	list: listCast,
	getMediaCast,

	// Update
	updateCastMember,

	// Delete
	deleteCastMember,
	deleteAllCast,
});
