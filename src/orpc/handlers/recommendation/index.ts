import { os } from "@/orpc/server";
import { getGenreBasedRecommendations, getTopRated, getTrending } from "./get";

export const recommendationProcedures = os.router({
	genreBased: getGenreBasedRecommendations,
	trending: getTrending,
	topRated: getTopRated,
});
