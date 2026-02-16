import { base } from "@/orpc/router/base";
import { addFavorite } from "./create";
import { removeFavorite } from "./delete";
import { checkFavorite, listFavorites } from "./get";

export const FavoriteRouter = base.router({
	add: addFavorite,
	list: listFavorites,
	check: checkFavorite,
	remove: removeFavorite,
});
