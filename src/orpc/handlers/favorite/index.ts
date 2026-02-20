import { os } from "@/orpc/root";
import { addFavorite } from "./create";
import { removeFavorite } from "./delete";
import { checkFavorite, listFavorites } from "./get";
import { toggleFavorite } from "./toggle";

export const FavoriteRouter = os.router({
	add: addFavorite,
	list: listFavorites,
	check: checkFavorite,
	remove: removeFavorite,
	toggle: toggleFavorite,
});
