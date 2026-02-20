import { os } from "@/orpc/root";
import { getGenreBasedRecommendations, getTopRated, getTrending } from "./get";

export const RecommendationRouter = os.router({
	genreBased: getGenreBasedRecommendations,
	trending: getTrending,
	topRated: getTopRated,
});
