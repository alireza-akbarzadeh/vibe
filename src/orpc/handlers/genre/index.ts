import { os } from "@/orpc/root";
import { createGenre } from "./create";
import { deleteGenre } from "./delete";
import { getGenre, listGenres } from "./get";
import { updateGenre } from "./update";

export const GenreRouter = os.router({
	create: createGenre,
	delete: deleteGenre,
	get: getGenre,
	list: listGenres,
	update: updateGenre,
});
