import { os } from "@/orpc/server";
import { addFavorite } from "./create";
import { removeFavorite } from "./delete";
import { checkFavorite, listFavorites } from "./get";
import { toggleFavorite } from "./toggle";

export const favoriteProcedures = os.router({
	add: addFavorite,
	list: listFavorites,
	check: checkFavorite,
	remove: removeFavorite,
	toggle: toggleFavorite,
});
