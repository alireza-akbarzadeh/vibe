import { os } from "@orpc/server";
import { castProcedures } from "./handlers/cast";
import { collectionProcedures } from "./handlers/collection";
import { contentProcedures } from "./handlers/content";
import { creatorProcedures } from "./handlers/creator";
import { favoriteProcedures } from "./handlers/favorite";
import { genreProcedures } from "./handlers/genre";
import { healthProcedures } from "./handlers/health/health.handlers";
import { libraryProcedures } from "./handlers/library";
import { mediaProcedures } from "./handlers/media";
import { mediaAssetProcedures } from "./handlers/media-asset";
import { peopleProcedures } from "./handlers/people";
import { permissionProcedures } from "./handlers/permission";
import { personProcedures } from "./handlers/person";
import { polarProcedures } from "./handlers/polar";
import { profileProcedures } from "./handlers/profile";
import { recommendationProcedures } from "./handlers/recommendation";
import { reviewProcedures } from "./handlers/review";
import { roleProcedures } from "./handlers/role";
import { roomProcedures } from "./handlers/streaming/room.handlers";
import { userProcedures } from "./handlers/user/user.handlers";
import { viewingHistoryProcedures } from "./handlers/viewing-history";
import { watchListProcedures } from "./handlers/watchlist";

export const appRouter = os.router({
	cast: castProcedures,
	collection: collectionProcedures,
	content: contentProcedures,
	creator: creatorProcedures,
	favorite: favoriteProcedures,
	genre: genreProcedures,
	health: healthProcedures,
	library: libraryProcedures,
	media: mediaProcedures,
	mediaAsset: mediaAssetProcedures,
	people: peopleProcedures,
	permission: permissionProcedures,
	person: personProcedures,
	polar: polarProcedures,
	profile: profileProcedures,
	recommendation: recommendationProcedures,
	review: reviewProcedures,
	role: roleProcedures,
	room: roomProcedures,
	user: userProcedures,
	viewingHistory: viewingHistoryProcedures,
	watchlist: watchListProcedures,
});

export type AppRouter = typeof appRouter;
